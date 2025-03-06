Бородин Никита Сергеевич ПрИ-23

Краткое содержание проекта:
Backend:

Использует Express для создания сервера.

Sequelize для работы с базой данных (PostgreSQL).

Passport и JWT для аутентификации.

Swagger для документации API.

bcrypt для хеширования паролей.

dotenv для управления переменными окружения.

Модели:

User и EventModel с ассоциациями один-ко-многим.

RefreshToken для управления refresh-токенами.

Роуты:

auth.ts для регистрации и авторизации.

public.ts для публичных маршрутов.

index.ts для защищенных маршрутов.

Конфигурации:

config.json для настройки подключения к базе данных.

passport.ts для настройки JWT-стратегии.

db.ts для подключения к базе данных.

Скрипты:

dev для запуска сервера с помощью nodemon.

test запуск теста

tsc запуск проекта с помощью typescript

format для форматирования

lint для отладки

check для вывода сводки о командах

Зависимости:

Основные: express, sequelize, passport, bcrypt, jsonwebtoken.

Dev-зависимости: typescript, eslint, prettier, nodemon.
