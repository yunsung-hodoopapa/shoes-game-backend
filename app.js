const express = require('express');
const { User } = require('./schemas/user');
const { Shoes } = require('./schemas/shoes');
const connect = require('./schemas');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRouter = require('./routes/auth');
const shoesRouter = require('./routes/shoes');

const app = express();

app.set('port', process.env.PORT || 3002);

connect();

// app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: ['https://shoesgame.app', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).send('hello');
});

app.use('/auth', authRouter);
app.use('/shoes', shoesRouter);

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

server.keepAliveTimeout = 65000; // Ensure all inactive connections are terminated by the ALB, by setting this a few seconds higher than the ALB idle timeout
server.headersTimeout = 66000;
