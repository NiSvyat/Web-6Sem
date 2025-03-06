import { Request, Response, Router } from 'express';
import EventModel from '../models/EventModel'; // Импортируем модель EventModel

const router: Router = Router();

// Публичный маршрут для получения списка мероприятий
router.get('/events', async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await EventModel.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error('Ошибка при получении мероприятий:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Экспортируем роутер
export default router;
