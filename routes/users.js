const { Router } = require('express');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

const router = Router();

router.use(requestLogger);

router.get('/me', (req, res, next) => {
  User.findById({ _id: req.user }, (err, user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.send({ data: user });
  })
    .catch(next);
});

router.use(errorLogger);
router.use(errors());

module.exports = router;
