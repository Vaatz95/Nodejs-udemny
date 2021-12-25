const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err)
    });
};
// Product.fetchAll()
//   .then(([rows, fieldData]) => {
//     res.render('shop/product-list', {
//       prods: rows,
//       pageTitle: 'All Products',
//       path: '/products'
//     })
//   }).catch(err => {
//     console.log(err);
//   });

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: product[0].title,
  //       path: '/products'
  //     })
  //   })
  //   .catch(err => console.log(err))
  //findAll을 활용해서 기존의 query 문법을 활용해 특정 데이터만을 뽑아낼 경우에는
  //해당 데이터가 기존의 쿼리 방식으로 찾았을때 처럼 배열로 나오기 때문에 주의!!
  Product.findByPk(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    }).catch(err => console.log(err));
};

// Product.findById(prodId)
//   .then(([product]) => {
//     res.render('shop/product-detail', {
//       prods: product[0],
//       pageTitle: product.title,
//       path: '/products'
//     })
//   }).catch(err => console.log(err));

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err)
    });
};
// Product.fetchAll()
//   .then(([rows, fieldData]) => {
//     res.render('shop/index', {
//       prods: rows,
//       pageTitle: 'Shop',
//       path: '/'
//     });
//   })
//   .catch(err => {
//     console.log(err);
//   });

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      console.log(cart);
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({
        where: {
          id: prodId
        }
      })
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQunatity = product.cartItem.quantity;
        newQuantity = oldQunatity + 1;
        return product;
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      })
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};
// const prodId = req.body.productId;
// Product.findById(prodId, product => {
//   Cart.addProduct(prodId, product.price);
// });
// res.redirect('/cart');

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      product.cartItem.destory();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err))
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = {
              quantity: product.cartItem.quantity
            }
            return product
            // map을 활용해서 기존 products의 데이터에 orderItem 부분에 cartItem에 담긴 숫자를 할당함으로서
            // 얼마나 주문하는지에 대한 정보를 따로 집어넣어줄 수 있다.
          }));
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    //include 뒤에 스트링(product로 각각 스트링으로 명시되어있는데 이를 복수형) sequlieze가 알아서 으로 해당 스트링에 관련된 정보를
    //하나의 배열로 담아서 보내주게 만들어 줄 수 있다.
    //order 테이블에 product에 관련된 것들을 배열에 담아서 준다.
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      });
    })
    .catch(err => console.lor(err))
  // res.render('shop/orders', {
  //   path: '/orders',
  //   pageTitle: 'Your Orders'
  // });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
