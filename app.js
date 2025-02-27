const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { authenticate } = require('./config/db');
const Event = require('./models/Event');
const User = require('./models/User');
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');
const app = express();
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { passport, generateToken } = require('./config/passport');
const authRouter = require('./routes/auth');
const publicRouter = require('./routes/public');
const protectedRouter = require('./routes/index');
const { RefreshToken } = require('../models/RefreshToken');

app.use(morgan(':method :url'));
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use('/auth', authRouter);
app.use('/', publicRouter);
app.use('/', protectedRouter);

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Events API',
            version: '1.0.0',
            description: 'API for managing events',
        },
        servers: [
            {
                url: 'http://localhost:8081',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'api_key', // Имя заголовка, который вы используете для API-ключа
                    description: 'API Key для доступа к защищенным маршрутам',
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
    },
    apis: ['./app.js'], // Укажите путь к файлам, где находятся ваши аннотации
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(apiKeyMiddleware);
const PORT = 8081;

// Проверяем соединение с базой данных
authenticate();

// Синхронизация модели с базой данных
const syncDatabase = async () => {
    try {
        await User.sync();
        console.log('Модель User успешно синхронизирована с базой данных.');
    } catch (error) {
        console.error('Ошибка при синхронизации модели User:', error);
    }
    try {
        await Event.sync();
        console.log('Модель Event успешно синхронизирована с базой данных.');
    } catch (error) {
        console.error('Ошибка при синхронизации модели Event:', error);
    }
};

// Вызов функции синхронизации
syncDatabase();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь с таким email не найден' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }

        // Генерация Access Token
        const accessToken = generateToken(user, '15m'); // Действителен 15 минут

        // Генерация Refresh Token
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Действителен 7 дней

        // Сохранение Refresh Token в базе данных
        await RefreshToken.create({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
        });

        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Ошибка при входе в систему:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh Token отсутствует' });
    }

    try {
        // Проверяем, существует ли Refresh Token в базе данных
        const tokenData = await RefreshToken.findOne({ where: { token: refreshToken } });
        if (!tokenData || tokenData.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Недействительный Refresh Token' });
        }

        // Находим пользователя
        const user = await User.findByPk(tokenData.userId);
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        // Генерация нового Access Token
        const accessToken = generateToken(user, '15m');

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({ message: 'Доступ разрешен', user: req.user });
});

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({ message: 'Доступ разрешен', user: req.user });
});



// Получение списка всех мероприятий
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     responses:
 *       200:
 *         description: Успешно получен список мероприятий
 *       500:
 *         description: Ошибка сервера
 */
app.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Получение одного мероприятия по ID
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешно получено мероприятие
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
app.get('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Ошибка при получении мероприятия:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Создание мероприятия
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               createdBy:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Успешно создано мероприятие
 *       400:
 *         description: Ошибка валидации данных
 *       500:
 *         description: Ошибка сервера
 */
app.post('/events', async (req, res) => {
    const { title, description, date, createdBy, category } = req.body;

    // Проверка обязательных данных
    if (!title || !date || !createdBy || !category) {
        return res.status(400).json({ message: 'Пожалуйста, укажите все обязательные поля' });
    }

    try {
        const newEvent = await Event.create({ title, description, date, createdBy, category });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Ошибка при создании мероприятия:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Получение списка пользователей
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список всех пользователей
 *     responses:
 *       200:
 *         description: Успешно получен список пользователей
 *       500:
 *         description: Ошибка сервера
 */
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Создание нового пользователя
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Успешно создан новый пользователь
 *       400:
 *         description: Ошибка валидации данных
 *       500:
 *         description: Ошибка сервера
 */
app.post('/users', async (req, res) => {
    const { name, email } = req.body;

    const clearExpiredTokens = async () => {
        try {
            await RefreshToken.destroy({ where: { expiresAt: { [Op.lt]: new Date() } } });
            console.log('Истекшие Refresh Token удалены');
        } catch (error) {
            console.error('Ошибка при удалении истекших токенов:', error);
        }
    };

// Запуск очистки каждые 24 часа
    setInterval(clearExpiredTokens, 24 * 60 * 60 * 1000);

    // Проверка обязательных данных
    if (!name || !email) {
        return res.status(400).json({ message: 'Пожалуйста, укажите все обязательные поля' });
    }

    try {
        // Проверка уникальности email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
const startServer = () => {
    app.listen(PORT, (err) => {
        if (err) {
            console.error(`Ошибка при запуске сервера: ${err.message}`);
            return;
        }
        console.log(`Сервер запущен на порту ${PORT}`);
    });
};

// Экспортируем объект приложения и функцию запуска сервера
module.exports = {
    app,
    startServer,
};

// Вызов функции запуска сервера
startServer();
