/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new NotAuthError('Необходима авторизация');
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, (NODE_ENV === 'production' ? JWT_SECRET : 'secret-key'));
  } catch (err) {
    throw new NotAuthError('Необходима авторизация');
  }
  req.user = payload._id; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
