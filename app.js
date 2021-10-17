const express = require('express');
const { User } = require('./schemas/user');
const connect = require('./schemas');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/auth');

const app = express();

app.set('port', process.env.PORT || 3002);

connect();

// app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: true,
    credential: true, // 도메인이 다른 경우 서로 쿠키등을 주고받을때 허용해준다고 한다.
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// app.get('/', (req, res) => res.send('hello world!!'));

app.use('/auth', authRouter);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
