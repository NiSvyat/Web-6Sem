const express = require('express');
const router = express.Router();
const { Event } = require('../models/Event'); // Импортируем модель Event

// Публичный маршрут для получения списка мероприятий
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
router.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Экспортируем роутер
module.exports = router;