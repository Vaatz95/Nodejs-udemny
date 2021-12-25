const path = require('path');

const express = require('express');

// const rootDir = require('../util/path');
// const adminData = require('./admin');

const shopController = require('../controllers/shop');

const router = express.Router();

// console.log('shop.js', adminData.products);
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.get('/checkout', shopController.getCheckOut);

module.exports = router;

// 이렇게 위에서 exports한 데이터를 로그하면 해당 데이터가 보인다.
// 하지만 여기서 문제는 이렇게 할 경우 서버 자체 노드의 저장되는 방식이기 때문에
// 다른 유저가 들어와도 현재 데이터가 공유되어 있다.
// res.render를 활용해 우리가 app에서 사용해놓은 전역 render엔진을 사용하게 한다.
// 기존에 처럼 sendFile을 사용해서 html을 안 res 해줘도 됨