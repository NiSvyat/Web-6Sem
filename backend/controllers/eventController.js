const { Event } = require('../models/Event');
const { User } = require('../models/User');
const { validateEventData } = require('../middleware/validateData');


// Create
const createEvent = async (req, res) => {

  // валидация данных
  const validation = validateEventData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const { createdBy } = req.body;

  try {
    // проверка существования пользователя
    const existingUser = await User.findOne({ where: { id: createdBy } });
    if (!existingUser) {
      return res.status(404).json({ message: 'пользователя не существует' });
    }

    // создание события
    const eventData = req.body;
    const newEvent = await Event.create(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: 'ошибка при создании мероприятия', details: error.message });
  }
};

// Get
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: 'ошибка при получении мероприятий', details: error.message });
  }
};

// Get by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'мероприятие не найдено' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: 'ошибка при получении мероприятия', details: error.message });
  }
};

// Update
const updateEvent = async (req, res) => {

  // валидация данных
  const validation = validateEventData(req.body, true);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  // обновление мороприятия
  try {
    const [updated] = await Event.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'мероприятие не найдено' });
    }
    const updatedEvent = await Event.findByPk(req.params.id);
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: 'ошибка при обновлении мероприятия', details: error.message });
  }
};

// Delete
const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'мероприятие не найдено' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: 'ошибка при удалении мероприятия', details: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};