
// функция для валидации данных пользователей
const validateUserData = async (data, userId = null) => {
  const { name, email, id } = data;

  // проверка на наличие id в запросе
  if (id) {
    return { valid: false, message: 'вы не можете задать ID' };
  }

  // проверка обязательных данных для создания
  if (!userId && (!name || !email)) {
    return { valid: false, message: 'укажите все обязательные поля (name, email)' };
  }

  // проверка типов данных
  if (name && typeof name !== 'string') {
    return { valid: false, message: 'имя должно быть строкой' };
  }
  if (email && typeof email!== 'string') {
    return { valid: false, message: 'почта должна быть строкой' };
  }

  // проверка на изменение запрещённого поля
  if (userId && data.hasOwnProperty('createdAt')) {
    return { valid: false, message: 'изменение времени создания запрещено' };
  }

  // проверка уникальности email
  if (userId) {
    const existingUser = await User.findOne({ where: { id: userId } });
    if (!existingUser) {
      return { valid: false, message: 'пользователь не найден' };
    }

    // для update
    if (data.email && existingUser.email !== data.email) {
      const emailExists = await User.findOne({ where: { email: data.email } });
      if (emailExists) {
        return { valid: false, message: 'пользователь с таким email уже существует' };
      }
    }
  } else {
    // для create
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return { valid: false, message: 'пользователь с таким email уже существует' };
    }
  }

  return { valid: true };
};

// функция для валидации данных мероприятий
const validateEventData = (data, isUpdate = false) => {
  const { title, date, location, createdBy, id} = data;

  // проверка на наличие id в запросе
  if (id) {
    return { valid: false, message: 'вы не можете задать ID' };
  }

  // проверка обязательных данных только для создания
  if (!isUpdate && (!title || !date || !location || !createdBy)) {
    return { valid: false, message: 'укажите все обязательные поля (title, date, locaton, createdBy' };
  }

  // проверка ID создателя для создания
  if (!isUpdate && createdBy && typeof createdBy !== 'number') {
    return { valid: false, message: 'ID создателя должен быть числом' };
  }

  // проверка типов данных
  if (title && typeof title !== 'string') {
    return { valid: false, message: 'название должно быть строкой' };
  }
  if (date && isNaN(Date.parse(date))) {
    return { valid: false, message: 'неверный формат даты (--.--.----)' };
  }
  if (location && typeof location !== 'string') {
    return { valid: false, message: 'местоположение должно быть строкой' };
  }

  // проверка на изменение запрещённых полей
  if (isUpdate && data.hasOwnProperty('createdBy')) {
    return { valid: false, message: 'изменение ID создателя запрещено' };
  }
  if (isUpdate && data.hasOwnProperty('createdAt')) {
    return { valid: false, message: 'изменение времени создания запрещено' };
  }

  return { valid: true };
};

module.exports = {
  validateUserData,
  validateEventData,
};
