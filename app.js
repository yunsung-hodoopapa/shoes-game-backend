const express = require('express');
// const path = require('path');
// const morgan = require('morgan');
// const nunjucks = require('nunjucks');
const { User } = require('./schemas/user');
const { auth } = require('./middleware/auth');
const connect = require('./schemas');
const cookieParser = require('cookie-parser');
cont cors = require('cors');

const app = express();

app.set('port', process.env.PORT || 3002);
// app.set('view engine', 'html');
// nunjucks.configure('views', {
//   express: app,
//   watch: true,
// });
connect();

// app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: true,
  credential: true, // 도메인이 다른 경우 서로 쿠키등을 주고받을때 허용해준다고 한다.
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   const error = new Error(`${req.method} ${req.url} 라우터가 없어졌습니다.`);
//   error.status = 404;
//   next(error);
// });

// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });

app.get('/', (req, res) => res.send('hello world!!'));
// app.use('/', indexRouter);
app.post('/register', (req, res) => {
  // 회원가입을 할때 필요한 것
  // post로 넘어온 데이터를 받아서 DB에 저장한다.
  const user = new User(req.body);
  console.log('-----');
  console.log(user);
  console.log('-----');
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
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

app.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAdmin: req.user.role === 09 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
  });
});

app.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token : ''}, (err, user) => {
    if (err) {
      return res.json({ success: false, err });
    }
    res.clearCookie('x_auth');
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
