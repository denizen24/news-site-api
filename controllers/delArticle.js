const Article = require('../models/article');
const ServerError = require('../errors/server-err');

module.exports.delArticle = (req, res, next) => {
  Article
    .findById({ _id: req.params.articleId })
    .then((data) => {
      if (!data) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      if (!(data.owner.toString() === req.user.toString())) {
        throw new ServerError('Нет прав удаление статьи');
      }
      Article.findByIdAndRemove(req.params.articleId)
        .then((article) => res.send({ data: article }))
        .catch(next);
    })
    .catch(next);
};
