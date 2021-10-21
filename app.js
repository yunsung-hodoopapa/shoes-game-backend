const express = require('express');
const { User } = require('./schemas/user');
const connect = require('./schemas');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const SneaksAPI = require('sneaks-api');

const authRouter = require('./routes/auth');

const app = express();
// const sneaks = new SneaksAPI();

app.set('port', process.env.PORT || 3002);

connect();

// app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// app.get('/', (req, res) => res.send('hello world!!'));

app.use('/auth', authRouter);

// //getProducts(keyword, limit, callback) takes in a keyword and limit and returns a product array
// sneaks.getProducts("newbalance 992", 10, function(err, products){
//   console.log(products)
// })
// //Product object includes styleID where you input it in the getProductPrices function
// //getProductPrices(styleID, callback) takes in a style ID and returns sneaker info including a price map and more images of the product
// sneaks.getProductPrices("FY2903", function(err, product){
//   console.log(product)
// })
// //getMostPopular(limit, callback) takes in a limit and returns an array of the current popular products curated by StockX
// sneaks.getMostPopular(10, function(err, products){
//   console.log(products)
// })
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
