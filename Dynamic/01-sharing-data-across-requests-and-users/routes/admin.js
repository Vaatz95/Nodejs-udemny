const path = require('path');

const express = require('express');

// const rootDir = require('../util/path');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

router.get('/products');

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// exports.routes = router;
// exports.products = products;
module.exports = router;

// 이렇게 exports 하는 방식으로 데이터를 공유하게 해줄 수 있는데

// module exports로 전환하면 export default로 똑같이 생각하면된다.
// 다중으로 여러개 exports 할려면 exports.~~~ = 전달할것
