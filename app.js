const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { authenticate } = require('./config/db');
const Event = require('./models/Event'); // Импортируем модель Event
const User = require('./models/User'); // Импортируем модель User

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

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

// Получение списка всех мероприятий
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
app.post('/events', async (req, res) => {
    const { title, description, date, createdBy } = req.body;

    // Проверка обязательных данных
    if (!title || !date || !createdBy) {
        return res.status(400).json({ message: 'Пожалуйста, укажите все обязательные поля' });
    }

    try {
        const newEvent = await Event.create({ title, description, date, createdBy });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Ошибка при создании мероприятия:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Обновление мероприятия
app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, date, createdBy } = req.body;

    // Проверка обязательных данных
    if (!title || !date || !createdBy) {
        return res.status(400).json({ message: 'Пожалуйста, укажите все обязательные поля' });
    }

    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }

        await event.update({ title, description, date, createdBy });
        res.status(200).json(event);
    } catch (error) {
        console.error('Ошибка при обновлении мероприятия:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Удаление мероприятия
app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }

        await event.destroy();
        res.status(204).send(); // Успешное удаление, без содержимого
    } catch (error) {
        console.error('Ошибка при удалении мероприятия:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Получение списка пользователей
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
app.post('/users', async (req, res) => {
    const { name, email } = req.body;

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
