import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate } from '@config/db';
import EventModel from '@models/EventModel';
import User from '@models/User';
import apiKeyMiddleware from '@middleware/apiKeyMiddleware';
import morgan from 'morgan';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
const app = express();
app.use(morgan(':method :url'));
app.use(express.json());
app.use(cors());

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
          name: 'api_key',
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
  apis: ['./src/app.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(apiKeyMiddleware);
const PORT = 8081;

// Проверяем соединение с базой данных
authenticate();

// Синхронизация модели с базой данных
const syncDatabase = async (): Promise<void> => {
  try {
    await User.sync();
    console.log('Модель User успешно синхронизирована с базой данных.');
  } catch (error) {
    console.error('Ошибка при синхронизации модели User:', error);
  }
  try {
    await EventModel.sync();
    console.log('Модель Event успешно синхронизирована с базой данных.');
  } catch (error) {
    console.error('Ошибка при синхронизации модели Event:', error);
  }
};

// Вызов функции синхронизации
syncDatabase();

// Получение списка всех мероприятий
app.get('/events', async (req: Request, res: Response) => {
  try {
    const events = await EventModel.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error('Ошибка при получении мероприятий:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Запуск сервера
export const startServer = (): void => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
};
