import { Request, Response, Router } from 'express';
import * as passport from 'passport'; // Импорт Passport
import EventModel from '../models/EventModel'; // Импорт модели EventModel

const router: Router = Router();

// Защищенный маршрут для получения одного мероприятия по ID
router.get(
  '/events/:id',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const event = await EventModel.findByPk(id);

      if (!event) {
        // Используем res.status().json() без return
        res.status(404).json({ message: 'Мероприятие не найдено' });
        return; // Завершаем выполнение функции
      }

      // Используем res.status().json() без return
      res.status(200).json(event);
    } catch (error) {
      console.error('Ошибка при получении мероприятия:', error);
      // Используем res.status().json() без return
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
);

// Экспортируем роутер
export default router;
