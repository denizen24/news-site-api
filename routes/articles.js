const { Router } = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const { createArticle } = require('../controllers/article');
const { delArticle } = require('../controllers/delArticle');
const ServerError = require('../errors/server-err');

const Article = require('../models/article');

const router = Router();

router.use(requestLogger);

router.get('/', (req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (!articles) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      res.send({ articles });
    })
    .catch(next);
});

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
}), delArticle);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(15),
    title: Joi.string().required().min(2).max(100),
    text: Joi.string().required().min(2).max(500),
    date: Joi.string().required().min(2).max(30),
    source: Joi.string().required().min(2).max(15),
    link: Joi.string().required().min(5),
    image: Joi.string().required().min(5),
  }),
}), createArticle);

router.use(errorLogger);
router.use(errors());

module.exports = router;
