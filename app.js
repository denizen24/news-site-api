const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const homeRoutes = require('./routes/home');
const usersRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const auth = require('./middlewares/auth');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const { NODE_ENV, MONGODB_DATABASE_URL, UNDF_ROUTE } = process.env;

const DATABASE_URL = (NODE_ENV === 'production' ? MONGODB_DATABASE_URL : 'mongodb://localhost:27017/news_site2');
const undfRoute = { message: (NODE_ENV === 'production' ? UNDF_ROUTE : 'Запрашиваемый ресурс не найден') };

const app = express();

app.set('trust proxy', 1);
app.use(cors(({
  credentials: true,
  origin: true,
})));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(helmet());
app.use(limiter);
app.use(compression());

app.use('/', homeRoutes);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(6).max(38),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(6).max(38),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use('/users', auth, usersRoutes);
app.use('/articles', auth, articleRoutes);

app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.use('*', (req, res) => {
  res.status(404).send(undfRoute);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT);
