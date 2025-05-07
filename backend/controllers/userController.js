const db = require('../models');
const User = db.User;
const Event = db.Event;
const RefreshToken = db.RefreshToken;
const { validateUserData } = require('../middleware/validateData');


// Create
const createUser = async (req, res) => {

  // валидация данных
  const validation = await validateUserData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  // создание пользователя
  try {
    const userData = req.body;
    const newUser = await User.create(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'ошибка при создании пользователя', details: error.message });
  }
};

// Get
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: 'ошибка при получении пользователей', details: error.message });
  }
};

// Get by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'пользователь не найден' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: 'ошибка при получении пользователя', details: error.message });
  }
};

// Update
const updateUser = async (req, res) => {

  // валидация данных
  const userId = req.params.id;
  const validation = await validateUserData(req.body, userId);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  // обновление пользователя
  try {
    const [updated] = await User.update(req.body, { where: { id: userId } });
    if (!updated) {
      return res.status(404).json({ error: 'пользователь не найден' });
    }
    const updatedUser = await User.findByPk(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'ошибка при обновлении пользователя', details: error.message });
  }
};

// Delete
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'пользователь не найден' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: 'ошибка при удалении пользователя', details: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};