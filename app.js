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

const corsOptions = {
  origin: [
    'https://shoesgame.app',
    'http://3.16.107.44:3002',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// app.get('/', (req, res) => res.send('hello world!!'));


app.use('/auth', authRouter);
app.use('/shoes', shoesRouter);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
