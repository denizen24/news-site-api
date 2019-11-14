const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const emailValidator = validate({
  validator: 'matches',
  arguments: /([a-z]+@[a-z]+)\.(?:[a-z]{2,6}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)/,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
