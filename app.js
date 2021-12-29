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

// const corsOptions = {
//   origin: 'https://shoesgame.app',
//   credentials: true,
// };
const whitelist  = ['http://localhost:3000', 'https://shoesgame.app', 'https://shoesgame.app/login']
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.options('*', cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', cors(corsOptionsDelegate), authRouter);
app.use('/shoes', shoesRouter);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
