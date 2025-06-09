import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import cors from 'cors';
import morgan from 'morgan';
import { authenticateDB } from '@config/db.js';
import userRoutes from '@routes/userRoutes.js';
import eventRoutes from '@routes/eventRoutes.js';
import { errorHandler } from '@middleware/errorHandler.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from '@config/swaggerConfig.js'; // Direct import
import passport from 'passport';
import db from './models/index.js';
import associate from './models/associations.js';
import authRoutes from '@routes/auth.js';
import '@config/passport';
import { fileURLToPath } from 'url';

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined');
  process.exit(1);
}

associate(db);

db.sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch((err: Error) => console.error('Database sync error:', err));

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',')
    : 'http://localhost:5173',
  methods: process.env.CORS_ALLOWED_METHODS
    ? process.env.CORS_ALLOWED_METHODS.split(',')
    : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With'
  ],
  credentials: true, // Если используете куки/авторизацию
  optionsSuccessStatus: 200
};
app.options('*', cors(corsOptions)); // Явная обработка preflight

//                             // Функция для очистки БД
// async function clearTables() {
//   try {
//     await db.sequelize.transaction(async (transaction) => {
//       // Отключаем проверку внешних ключей (для PostgreSQL)
//       await db.sequelize.query('SET session_replication_role = replica;', { transaction });
//
//       // Очищаем таблицы
//       await db.RefreshToken.destroy({ truncate: true, cascade: true, transaction });
//       await db.User.destroy({ truncate: true, cascade: true, transaction });
//
//       // Включаем проверку обратно
//       await db.sequelize.query('SET session_replication_role = DEFAULT;', { transaction });
//     });
//
//     console.log('Все таблицы успешно очищены');
//   } catch (error) {
//     console.error('Ошибка при очистке таблиц:', error);
//   }
// }
//
// // Вызов функции
// clearTables();

app.use(express.json());
app.use(cors(corsOptions));
app.use(passport.initialize());

app.use('/auth', authRoutes);

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

// Fix errorHandler middleware usage
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});
app.use(morgan('dev'));
app.use(userRoutes);
app.use(eventRoutes);

const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {  // Fixed unused req parameter
  res.json({ message: 'мефедрон' });
});

app.listen(PORT, async (err?: Error) => {
  if (err) {
    console.error(`ошибка при запуске сервера: ${err.message}`);
    return;
  }
  console.log(`сервер запущен на порту ${PORT}`);

  await authenticateDB();
});