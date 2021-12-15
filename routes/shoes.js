const express = require('express');
const { Shoes } = require('../schemas/shoes');
const { FollowingShoes } = require('../schemas/followingShoes');
const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const router = express.Router();

const DEFAULT_LIMIT = require('../constants/index');

router.post('/regist', async (req, res, next) => {
  try {
    const shoes = await Shoes.create({
      shoeName: req.body.shoeName,
      shoeSize: req.body.shoeSize,
      shoePrice: req.body.shoePrice,
      buyingDate: req.body.buyingDate,
      thumbnail: req.body.thumbnail,
      brand: req.body.brand,
      styleID: req.body.styleID,
      retailPrice: req.body.retailPrice,
      resellPrice: req.body.resellPrice,
    });
    const inStoreShoes = await Shoes.find({});
    res.status(200).json(inStoreShoes);
  } catch (err) {
    console.error(err);
    next(err);
  }
  // console.log(req.body);
  // const shoes = new Shoes(req.body);
  // console.log(shoes);
  // shoes.save((err, inputValue) => {
  //   if (err) return res.json({ success: false, err });
  //   return res.status(200).json({ success: true });
  // });
});

router.post('/regist/following', async (req, res, next) => {
  try {
    const shoes = await FollowingShoes.create({
      shoeName: req.body.shoeName,
      shoeSize: req.body.shoeSize,
      shoePrice: req.body.shoePrice,
      thumbnail: req.body.thumbnail,
      brand: req.body.brand,
      styleID: req.body.styleID,
      retailPrice: req.body.retailPrice,
      resellPrice: req.body.resellPrice,
      lowestResellPrice: req.body.lowestResellPrice
    });
    const inStoreShoes = await FollowingShoes.find({});
    res.status(200).json(inStoreShoes);
  } catch (err) {
    console.error(err);
    next(err);
  }
  // console.log(req.body);
  // const shoes = new Shoes(req.body);
  // console.log(shoes);
  // shoes.save((err, inputValue) => {
  //   if (err) return res.json({ success: false, err });
  //   return res.status(200).json({ success: true });
  // });
});

router.patch('/shoesInfo', async (req, res, next) => {
  try {
    const updateShoeInfo = await Shoes.findOneAndUpdate(
      {
        _id: ObjectId(req.body._id),
      },
      {
        $set: {
          shoeName: req.body.shoeName,
          shoeSize: req.body.shoeSize,
          shoePrice: req.body.shoePrice,
          buyingDate: req.body.buyingDate,
          thumbnail: req.body.thumbnail,
          brand: req.body.brand,
          styleID: req.body.styleID,
          retailPrice: req.body.retailPrice,
          resellPrice: req.body.resellPrice,
        },
      }
    );
    const inStoreShoes = await Shoes.find({});
    res.status(200).json(inStoreShoes);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/shoesInfo/delete_by_id', async (req, res, next) => {
  try {
    const deleteShoeInfo = await Shoes.deleteOne({
      _id: ObjectId(req.body._id)
    });
    const inStoreShoes = await Shoes.find({});
    res.status(200).json(inStoreShoes);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/managed-shoesInfo', async (req, res, next) => {
  try {
    const savedShoesData = await Shoes.find({});
    res.status(200).json(savedShoesData);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/managed-shoesInfo/following', async (req, res, next) => {
  try {
    const savedShoesData = await FollowingShoes.find({});
    res.status(200).json(savedShoesData);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/search', (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    sneaks.getProducts(keyword, (limit = DEFAULT_LIMIT), (err, products) => {
      console.log(products);
      // try {
      if (err) {
        console.log(err);
        // throw err;
      }
      return res.json(products);
      // } catch (err) {
      // throw err;
      // }
    });
  } catch (err) {
    // 일단 작동을 하지 않고 있음.
    console.log('here');
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
router.get('/search/price:styleID', (req, res, next) => {
  try {
    const styleID = req.query.styleID;
    sneaks.getProductPrices(styleID, (err, products) => {
      console.log(products.resellPrices.stockX);
      if (err) {
        console.log(err);
      }
      return res.json(products.resellPrices.stockX)
    })
  } catch (err) {
    console.log(err);
  }
});
// Product object includes styleID where you input it in the getProductPrices function
// getProductPrices(styleID, callback) takes in a style ID and returns sneaker info including a price map and more images of the product


// getMostPopular(limit, callback) takes in a limit and returns an array of the current popular products curated by StockX
// sneaks.getMostPopular(limit , function(err, products){
//   console.log(products)
// })

// app.use('/shoes' shoesRouter);
module.exports = router;
