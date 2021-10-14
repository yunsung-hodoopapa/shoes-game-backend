const express = require('express');
// const path = require('path');
// const morgan = require('morgan');
// const nunjucks = require('nunjucks');
const { User } = require('./schemas/user');

const connect = require('./schemas');
const indexRouter = require('./routes');
const bodyParser = require('body-parser');

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  console.log('-----');
  console.log(req.body);
  console.log('-----');
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
