import express, { Request, Response, NextFunction } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import { checkTrustedOrigin } from '../middleware/checkTrustedOrigin';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление событиями
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое событие
 *     description: Создает новое событие с указанными данными
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Событие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка валидации или создания события
 */
router.post('/events', checkTrustedOrigin("POST"),
  (req: Request, res: Response, next: NextFunction) => {
    createEvent(req, res).catch(next);
  }
);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     description: Возвращает список всех мероприятий
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка при получении мероприятий
 */
router.get('/events', checkTrustedOrigin("GETS"),
  (_req: Request, res: Response, next: NextFunction) => {
    getEvents(_req, res).catch(next);
  }
);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     description: Возвращает мероприятие по его ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Ошибка при получении мероприятия
 */
router.get('/events/:id', checkTrustedOrigin("GET"),
  (req: Request, res: Response, next: NextFunction) => {
    getEventById(req, res).catch(next);
  }
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновить мероприятия по ID
 *     description: Обновляет данные мероприятия по его ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Мероприятие успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Ошибка валидации или обновления мероприятия
 */
router.put('/events/:id', checkTrustedOrigin("PUT"),
  (req: Request, res: Response, next: NextFunction) => {
    updateEvent(req, res).catch(next);
  }
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить мероприятие по ID
 *     description: Удаляет мероприятие по его ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       204:
 *         description: Мероприятие успешно удалено
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Ошибка при удалении мероприятия
 */
router.delete('/events/:id', checkTrustedOrigin("DELETE"),
  (req: Request, res: Response, next: NextFunction) => {
    deleteEvent(req, res).catch(next);
  }
);

export default router;