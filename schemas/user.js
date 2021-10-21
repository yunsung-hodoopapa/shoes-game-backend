const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

// saltRounds는 암호화된 문구의 길이를 의미한다.

const { Schema } = mongoose;

const userSchema = new Schema({
  id: {
    type: String,
  },
  oAuthId: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    minlength: 5,
  },
  name: {
    type: String,
    maxlength: 50,
  },
  roles: {
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
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
  token_type: {
    type: String,
  },
});

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

userSchema.methods.comparePassword = function (plainPassword, cb) {
  return bcrypt
    .compare(plainPassword, this.password)
    .then((isMatch) => isMatch)
    .catch((err) => err);
};

userSchema.methods.generateToken = function () {
  const user = this;
  //jwt.sign을 이용해서 jwt 토큰을 생성해준다.
  const token = jwt.sign(this._id.toHexString(), 'secretToken');
  this.token = token;
  return this.save()
    .then((user) => user)
    .catch((err) => err);
};

userSchema.statics.findByToken = function (token) {
  // 항시 사용가능한 메소드 statics
  let user = this;
  // secretToken을 통해 user의 id값을 받아오고 해당 아이디를 통해
  // DB에 접근해서 유저의 정보를 가져온다.
  return jwt.verify(token, 'secretToken', function (err, decoded) {
    // jwt.verify(토큰, '지정해둔 특정문자')를 넣어서 decoded된 값을 통해 _id와 db를 조회해서 값을 너겨준다.
    return user
      .findOne({ _id: decoded, token: token })
      .then((user) => user)
      .catch((err) => err);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
