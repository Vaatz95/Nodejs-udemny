const Product = require('../models/product');

exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop', { prods: products, pageTitle: "Shop", path='/' });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', { prods: products, pageTitle: "Shop", path='/' });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', { path: '/cart', pageTitle: 'Your Cart' })
}

exports.getCheckOut = (req, res, next) => {
  res.render('shop/checkout', { path: '/checkout', pageTitle: 'CheckOut' })
};

//fetchAll은 static 메소드임

// fetchAll만 단순 실행시에 나오는 length가 없다는 오류 해결방식
// fetchAll이 돌려주는 것을 기반으로 callback 함수가 인자를 받으면서
// 그것을 바탕으로 shop을 랜더하게 해준다.
