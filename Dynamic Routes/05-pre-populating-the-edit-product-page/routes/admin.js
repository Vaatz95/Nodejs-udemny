const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;

// 작성할때 절차 view를 생각한다 일단 (무엇을 만들어야 할까) => 해당 url로 갈때 (route) 무엇을 render 해야하나 (controller) => 해당 컨트롤러에서는 무슨 데이터를 받아서 혹은 router에서 받은 param
//을 활용해서 model에서 무슨 데이터를 받아와야 하는가 => 그리고 그것을 활용해서 무엇을 render 해야 하는가 (res.render);