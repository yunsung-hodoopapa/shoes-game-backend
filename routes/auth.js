const express = require('express');
const { auth } = require('../middleware/auth');
// const { isLoggedIn, isNotLoggedIn } = require('../middleware/login');
const { User } = require('../schemas/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  // 회원가입을 할때 필요한 것
  // post로 넘어온 데이터를 받아서 DB에 저장한다.
  // const { id, name, password } = req.body;
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
              loginSuccess : true,
              'userId': user._id
            }
            res.cookie('x_auth', user.token).status(200).json(resJson);
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
  // User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
  //   if (err) {
  //     return res.json({ success: false, err });
  //   }
  //   return res.status(200).send({
  //     success: true,
  //   });
  // });
});

const kakao = {
  clientID: process.env.KAKAO_CLIENT_ID,
  clientSecret: process.env.KAKAO_CLIENT_SECRET,
  redirectUri: process.env.KAKAO_REDIRECT_URI,
};

router.post('/kakao', async (req, res) => {
  if (req.body.access_token) {
    User.findOne({ access_token: req.body.access_token }, (err, user) => {
      if (!user) {
        console.log(req.body);
        const user = new User(req.body);
        user.save((err, doc) => {
          //json 형식으로 보내준다.
          if (err) {
            return res.json({ success: false, err });
          }
          return res.status(200).json({ success: true, err });
        });
        user
          .generateToken()
          .then((user) => {
            res
              .cookie('x_auth', user.token) //쿠키에 JWT토큰을 넣어준다.
              .status(200)
              .json({
                registerSuccess: true,
                socialLoginSuccess: true,
                userId: user._id,
                token: user.token,
              });
          })
          .catch((err) => {
            res.json({ socialLoginSuccess: false, err });
          });
      }
      user.token = req.body.access_token;
      user.save((error, user) => {
        if (error) {
          return res.status(400).json({ error: 'something wrong' });
        }
        return res.cookie('x_auth', user.token).status(200).json({
          socialLoginSuccess: true,
          userId: user._id,
          token: user.token,
        });
      });
      // res.status(200).json({ socialLoginSuccess: true, user})
    });
  }
});
// // const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?
// // client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&
// // response_type=code&scope=profile,account_email`;

// // res.redirect(kakaoAuthURL);
// newUser.generateToken((err, user) => {
//   if (err) {
//     return res.status(400).send(err);
//   }
//   res
//     .cookie('x_auth', user.token)
//     .status(200)
//     .json({ loginSuccess: true, userId: user._id, token: user.token });
// });
//   res.cookie('x_auth', access_token);
// });

router.get('/callback', (req, res) => {
  const requestToken = req.query.code; //
  axios({
    method: 'post',
    url,
  });
});

// router.get('/kakao/callback', async (req, res) => {
//   console.log('here', req.body.access_token);
//   res.cookie('x_auth', req.body.access_token);
//   if (req.body.access_token) {
//     // 요청 body에 토큰 키가 존재하는지 체크한다.
//     // 만일 존재한다면, DB에 해당하는 토큰키를 갖고 있는 유저를 탐색한다.
//     try {
//       const exUser = await User.findOne({
//         id : req.body.email,
//       });
//       if (exUser) {
//         done(null, exUser);
//       } else {
//         const newUser = await User.create({
//           email: req.body.id,
//           nickname: req.body.nickname,
//           image: req.body.image,
//         });
//         done(null, newUser);
//       }
//     } catch (error) {
//       console.error(error);
//       done(error);
//     }
//   }
// });
//   let access_token;
//   try {
//     access_token = await axios({
//       method: 'POST',
//       url: 'https://kauth.kakao.com/oauth/token',
//       headers: {
//         'content-type': 'application/x-www-form-urlencoded',
//       },
//       data: qs.stringify({
//         grant_type: 'authorization_code', //특정 스트링
//         client_id: kakao.clientID,
//         client_secret: kakao.clientSecret,
//         redirectUri: kakao.redirectUri,
//         code: req.query.code,
//       }),
//     });
//   } catch (err) {
//     res.json(err.data);
//   }
//   // 유저정보 받아오기
//   let user;
//   try {
//     console.log(access_token);
//     user = await axios({
//       method: 'get',
//       url: 'https://kapi.kakao.com/v2/user/me',
//       headers: {
//         Authorization: `Bearer ${token.data.access_token}`,
//       }, //헤더에 내용을 보고 보내주겠다.
//     });
//     console.log('1', user);
//   } catch (error) {
//     res.json(error.data);
//   }
//   console.log(user);
//   res.send('success');
// });

module.exports = router;
