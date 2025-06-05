import db from '../models/index.js'; // Import the default export

// Then access User through db:
const { User } = db;

interface ValidationResult {
  valid: boolean;
  message?: string;
}

interface UserData {
  name?: string;
  email?: string;
  id?: any;
  createdAt?: any;
  [key: string]: any;
}

interface EventData {
  title?: string;
  date?: string;
  location?: string;
  createdBy?: number;
  id?: any;
  createdAt?: any;
  [key: string]: any;
}

// функция для валидации данных пользователей
const validateUserData = async (data: UserData, userId: number | null = null): Promise<ValidationResult> => {
  const { name, email, id } = data;

  if (id) {
    return { valid: false, message: 'вы не можете задать ID' };
  }

  if (!userId && (!name || !email)) {
    return { valid: false, message: 'укажите все обязательные поля (name, email)' };
  }

  if (name && typeof name !== 'string') {
    return { valid: false, message: 'имя должно быть строкой' };
  }
  if (email && typeof email !== 'string') {
    return { valid: false, message: 'почта должна быть строкой' };
  }

  if (userId && data.hasOwnProperty('createdAt')) {
    return { valid: false, message: 'изменение времени создания запрещено' };
  }

  if (userId) {
    const existingUser = await User.findOne({ where: { id: userId } });
    if (!existingUser) {
      return { valid: false, message: 'пользователь не найден' };
    }

    if (data.email && existingUser.email !== data.email) {
      const emailExists = await User.findOne({ where: { email: data.email } });
      if (emailExists) {
        return { valid: false, message: 'пользователь с таким email уже существует' };
      }
    }
  } else {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return { valid: false, message: 'пользователь с таким email уже существует' };
    }
  }

  return { valid: true };
};

// функция для валидации данных мероприятий
const validateEventData = (data: EventData, isUpdate: boolean = false): ValidationResult => {
  const { title, date, location, createdBy, id } = data;

  if (id) {
    return { valid: false, message: 'вы не можете задать ID' };
  }

  if (!isUpdate && (!title || !date || !location || !createdBy)) {
    return { valid: false, message: 'укажите все обязательные поля (title, date, location, createdBy)' };
  }

  if (!isUpdate && createdBy && typeof createdBy !== 'number') {
    return { valid: false, message: 'ID создателя должен быть числом' };
  }

  if (title && typeof title !== 'string') {
    return { valid: false, message: 'название должно быть строкой' };
  }
  if (date && isNaN(Date.parse(date))) {
    return { valid: false, message: 'неверный формат даты (--.--.----)' };
  }
  if (location && typeof location !== 'string') {
    return { valid: false, message: 'местоположение должно быть строкой' };
  }

  if (isUpdate && data.hasOwnProperty('createdBy')) {
    return { valid: false, message: 'изменение ID создателя запрещено' };
  }
  if (isUpdate && data.hasOwnProperty('createdAt')) {
    return { valid: false, message: 'изменение времени создания запрещено' };
  }

  return { valid: true };
};

export {
  validateUserData,
  validateEventData,
};