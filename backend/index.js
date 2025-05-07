const express = require('express');
const dotenv = require('dotenv'); // для загрузки из .env
const cors = require('cors');
const morgan = require('morgan');
const { authenticateDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

const errorHandler = require('./middleware/errorHandler');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerConfig = require('./config/swaggerConfig');

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined');
  process.exit(1);
}

const db = require('./models');
const associate = require('./models/associations');

associate(db);

db.sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

const passport = require('passport');
require('./config/passport');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : '*',
  methods: process.env.CORS_ALLOWED_METHODS ? process.env.CORS_ALLOWED_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(passport.initialize());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

app.use(morgan('[:method] :url'));

app.use(errorHandler);

app.use(userRoutes);
app.use(eventRoutes);

const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.json({ message: 'мефедрон' });
});

app.listen(PORT, async (err) => {
  if (err) {
    console.error(`ошибка при запуске сервера: ${err.message}`);
    return;
  }
  console.log(`сервер запущен на порту ${PORT}`);

  await authenticateDB();
});