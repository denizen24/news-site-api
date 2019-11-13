const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const urlValidator = validate({
  validator: 'matches',
  arguments: /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/,
});

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
    maxlength: 30,
  },
  text: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: urlValidator,
  },
  image: {
    type: String,
    required: true,
    validate: urlValidator,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
