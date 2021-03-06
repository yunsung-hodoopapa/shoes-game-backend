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
      lowestResellPrice: req.body.lowestResellPrice.stockX,
    });
    const inStoreShoes = await FollowingShoes.find({});
    res.status(200).json(inStoreShoes);
  } catch (err) {
    console.error(err);
    next(err);
  }
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
      _id: ObjectId(req.body.data),
    });
    const inStoreShoes = await Shoes.find({});
    res.status(200).json(inStoreShoes);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/following/delete', async (req, res, next) => {
  try {
    const deleteShoeInfo = await FollowingShoes.deleteOne({
      _id: ObjectId(req.body.data),
    });
    const inStoreShoes = await FollowingShoes.find({});
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
      }
      return res.json(products);
    });
  } catch (err) {
    console.log('here');
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.get('/search/price:styleID', (req, res, next) => {
  try {
    const styleID = req.query.styleID;
    sneaks.getProductPrices(styleID, (err, products) => {
      console.log(products.resellPrices.stockX);
      if (err) {
        console.log(err);
      }
      return res.json(products.resellPrices.stockX);
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
