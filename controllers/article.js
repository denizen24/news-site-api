const Article = require('../models/article');
const ServerError = require('../errors/server-err');

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = (req.user);
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      if (!article) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      res.send({ data: article });
    })
    .catch(next);
};
