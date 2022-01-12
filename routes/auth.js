const express = require('express');
const { auth } = require('../middleware/auth');
const { User } = require('../schemas/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ user: req.body.email }, (err, user) => {
    if (err) {
      console.log('error occured');
      return res.json({
        loginSuccess: false,
        message: '존재하지 않는 아이디입니다.',
      });
    }
    user
      .comparePassword(req.body.password)
      .then((isMatch) => {
        if (!isMatch) {
          res.json({
            loginSuccess: false,
            message: '비밀번호가 일치하지 않습니다',
          });
        }
        user
          .generateToken()
          .then((user) => {
            console.log('token generate');
            const resJson = {
              loginSuccess: true,
              user: user,
              userId: user._id,
            };
            res.cookie('x_auth', user.token, {
              httpOnly: false,
              sameSite: 'None',
              secure: true,
            });
            res.status(200).json(resJson);
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

router.get('/users', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    nickname: req.user.nickname,
    image: req.user.image,
    role: req.user.role,
  });
});

router.post('/logout', (req, res) => {
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: req.body._id },
    { token: '' },
    (err, user) => {
      if (err) {
        return res.json({ success: false, err });
      }
      return res.status(200).send({
        success: true,
        user: {},
      });
    }
  );
});

const kakao = {
  clientID: process.env.KAKAO_CLIENT_ID,
  clientSecret: process.env.KAKAO_CLIENT_SECRET,
  redirectUri: process.env.KAKAO_REDIRECT_URI,
};

router.post('/kakao', async (req, res) => {
  if (req.body.access_token) {
    User.findOne({ access_token: req.body.access_token }, async (err, user) => {
      console.log('function operation');
      if (!user) {
        const user = new User(req.body);
        user.save((err) => {
          //json 형식으로 보내준다.
          if (err) {
            res.json({ success: false, err });
          }
          user
            .generateToken()
            .then((user) => {
              console.log(user);
              console.log(typeof user);
              res.cookie('x_auth', user.token, {
                httpOnly: false,
                sameSite: 'None',
                secure: true,
              });
              return res.status(200).json({
                registerSuccess: true,
                socialLoginSuccess: true,
                user: user,
                userId: user._id,
                token: user.token,
              });
            })
            .catch((err) => {
              res.json({ socialLoginSuccess: false, err });
            });
        });
        return;
      }
      user.token = req.body.access_token;
      user.save((error, user) => {
        console.log(user);
        console.log(typeof user);
        console.log('here3');
        if (error) {
          return res.status(400).json({ error: 'something wrong' });
        }
        return res
          .cookie('x_auth', user.token, {
            httpOnly: false,
            sameSite: 'None',
            secure: true,
          })
          .status(200)
          .json({
            socialLoginSuccess: true,
            user: user,
            userId: user._id,
            token: user.token,
          });
      });
      // console.log('complete');
      // res.status(200).json({ socialLoginSuccess: true, user });
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
