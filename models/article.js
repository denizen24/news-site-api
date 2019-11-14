const mongoose = require('mongoose');
require('mongoose-type-url');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  text: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
  },
  date: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  source: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  link: {
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
  image: {
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
