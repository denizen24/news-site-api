const { Router } = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const { createArticle } = require('../controllers/article');
const ServerError = require('../errors/server-err');

const Article = require('../models/article');

const router = Router();
const errRoute = { message: 'Нет карточки с таким id' };

router.use(requestLogger);

router.get('/', (req, res, next) => {
  Article.find({})
    .then((article) => {
      if (!article) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      res.send({ data: article });
    })
    .catch(next);
});

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
}), (req, res) => {
  Article
    .findById({ _id: req.params.articleId }, (err, data) => {
      if (!data) {
        return res
          .status(404).send(errRoute)
          .end();
      }
      if (!(data.owner.toString() === req.user.toString())) {
        return res
          .status(401)
          .send({ message: 'Нет прав на удаление статьи' })
          .end();
      }
      Article.findByIdAndRemove(req.params.articleId)
        .then((article) => res.send({ data: article }))
        .catch(() => res.status(404).send(errRoute));
      return undefined;
    });
});

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(15),
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2).max(500),
    data: Joi.date().required().max('now').timestamp('javascript'),
    source: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(5),
    image: Joi.string().required().min(5),
  }),
}), createArticle);

router.use(errorLogger);
router.use(errors());

module.exports = router;
