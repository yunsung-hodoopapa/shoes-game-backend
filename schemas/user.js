const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// saltRounds는 암호화된 문구의 길이를 의미한다.

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    email: {
      type: String,
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      minlength: 5,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    provider: {
      type: String,
    },
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
    last_login_date: {
    type: Date,
    },
  },
);

//save 메소드가 실행되기 전에 비밀번호를 암호화하는 로직을 짜야한다.
userSchema.pre('save', function (next) {
  let user = this;

  //model1 안의  password가 변환될때만 암호화한다.
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
