export default {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event and User API',
      version: '1.0.0',
      description: 'API для управления событиями и пользователями',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Локальный сервер',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID пользователя',
            },
            name: {
              type: 'string',
              description: 'Имя пользователя',
            },
            email: {
              type: 'string',
              description: 'Email пользователя',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания пользователя',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата последнего обновления пользователя',
            },
          },
        },
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID события',
            },
            title: {
              type: 'string',
              description: 'Название события',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Дата события',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания события',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата последнего обновления события',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Changed to .ts and added src path
};