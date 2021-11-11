const express = require('express');
const { User } = require('./schemas/user');
const connect = require('./schemas');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const DEFAULT_LIMIT = require('./constants/index');

dotenv.config();

const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();

const authRouter = require('./routes/auth');

const app = express();

app.set('port', process.env.PORT || 3002);

connect();

// app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// app.get('/', (req, res) => res.send('hello world!!'));

app.use('/auth', authRouter);

app.get('/shoes/:search', (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    console.log(keyword);
    sneaks.getProducts(keyword, (limit = DEFAULT_LIMIT), (err, products) => {
      // try {
      if (err) {
        console.log(err);
        throw err;
      }
      return res.json(products);
      // } catch (err) {
      // throw err;
      // }
    });
  } catch (err) {
    // 일단 작동을 하지 않고 있음.
    console.log('here');
    console.log(err.message);
    return res.status(400).json({
      message: err.message,
    });
  }
  // } catch (err) { // 에러 객체  {message: '', code: '', ...};
  //   return res.status(400).json({
  //   });
  // return res.json({
  //   status: 400,
  //   message: err // 문자열 넣기. 받아서 넣거나 내가 정한 문자열 넣어주거나 -> 상수 처리
  // });
});
// getProducts(keyword, limit, callback) takes in a keyword and limit and returns a product array

// Product object includes styleID where you input it in the getProductPrices function
// getProductPrices(styleID, callback) takes in a style ID and returns sneaker info including a price map and more images of the product
// sneaks.getProductPrices(styleId, function(err, product){
//   console.log(product)
// })

// getMostPopular(limit, callback) takes in a limit and returns an array of the current popular products curated by StockX
// sneaks.getMostPopular(limit , function(err, products){
//   console.log(products)
// })

// app.use('/shoes' shoesRouter);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
