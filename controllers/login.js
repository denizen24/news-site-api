const jwt = require('jsonwebtoken');
const User = require('../models/user').default;
const NotAuthError = require('../errors/not-auth');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotAuthError('Ошибка авторизации');
      }
      const token = jwt.sign(
        { _id: user._id },
        (NODE_ENV === 'production' ? JWT_SECRET : 'secret-key'),
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'авторизация - OK' })
        .end();
    })
    .catch(next);
};
