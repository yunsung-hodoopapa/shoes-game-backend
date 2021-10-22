const express = require('express');
const { auth } = require('../middleware/auth');
// const { isLoggedIn, isNotLoggedIn } = require('../middleware/login');
const { User } = require('../schemas/user');

const router = express.Router();

router.post('/register', (req, res) => {
  // 회원가입을 할때 필요한 것
  // post로 넘어온 데이터를 받아서 DB에 저장한다.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '존재하지 않는 아이디입니다.',
      });
    }
    user.comparePassword(req.body.password)
      .then((isMatch) => {
        if (!isMatch) {
          res.json({
            loginSuccess: false,
            message: '비밀번호가 일치하지 않습니다',
          });
        }
        console.log('here', user);
        user
          .generateToken()
          .then((user) => {
            console.log(user.token);
            res
              .cookie('x_auth', user.token)
              .status(200)
              .json({ loginSuccess: true, userId: user._id });
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      })
      .catch((err) => {
        res.json({ loginSuccess: false, err });
      });
  });
});

router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAdmin: req.user.role === 09 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
  });
});

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) {
      return res.json({ success: false, err });
    }
    res.clearCookie('x_auth');
    res.redirect('/');
    return res.status(200).send({
      success: true,
    });
  });
});

router.post('/kakao', (req, res) => {
  console.log(req.body.access_token);
  if (req.body.access_token) {
    res.cookie('x_auth', req.body.access_token);
    // 요청 body에 토큰 키가 존재하는지 체크한다.
    // 만일 존재한다면, DB에 해당하는 토큰키를 갖고 있는 유저를 탐색한다.
    User.findOne({ access_token: req.body.access_token }, (err, user) => {
      if (!user) {
        const userSchema = new User(req.body);
        console.log('저장중..');
        console.log(req.body);
        // 계정을 추가한다.
        userSchema.save((err) => {
          if (err) {
            return res.json({ success: false, err });
          }
          console.log('saving...');
          return res.status(200).json({
            registerSuccess: true,
          });
        });
      }
      // console.log(user);
      // user.generateToken((err, user) => {
      //   if (err) {
      //     return res.status(400).send(err);
      //   }
      //   res
      //     .cookie('x_auth', user.token)
      //     .status(200)
      //     .json({ loginSuccess: true, userId: user._id, token: user.token });
      // });
    });
  }
});

router.get('/callback', (req, res) => {
  const requestToken = req.query.code; //
  axios({
    method: 'post',
    url,
  });
});

module.exports = router;
