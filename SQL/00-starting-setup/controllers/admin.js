const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title,
    price,
    imageUrl,
    description,
  })
    .then(result => {
      console.log(result);
      res.redirect('/admin/products');
    }).catch(err => {
      console.log(err);
    })
};
// 관계를 설정하면 새로운 관계된 객체를 형성할 수 있게된다.
// 유저가 설정한 관계와 연관된 메소드를 만들 수 있게 된다.

// Product.create({
//   title,
//   price,
//   imageUrl,
//   description,
// }).then(result => {
//   console.log(result);
//   res.redirect('/admin/products');
// }).catch(err => {
//   console.log(err);
// })

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({
    where: { id: prodId }
  })
    // Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      if (product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    }).catch(err =>
      console.log(err)
    )
}

// const editMode = req.query.edit;
// if (!editMode) {
//   return res.redirect('/');
// }
// const prodId = req.params.productId;
// Product.findById(prodId, product => {
//   if (!product) {
//     return res.redirect('/');
//   }
//   res.render('admin/edit-product', {
//     pageTitle: 'Edit Product',
//     path: '/admin/edit-product',
//     editing: editMode,
//     product: product
//   });
// });

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId).then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save();
  }).then(result => {
    console.log('UPDATED');
    res.redirect('/');
  })
    .catch(err => console.log(err));
};
// 기억하자 비동기로 작동하기 때문에 실행을 하면 
// 이전 작업과 동기적으로 이행되는게 아니라 그냥 각각 작업을 바로 실행시킨다.
// 그렇기 때문에 위에 then 구문안에 있는 redirect가 then 구문 밖에 있었을 경우에는
// 우리가 update를 진행해도 새로운 값으로 갱신되는걸로 redirect 되지 않고 바로 redirect된다.
// 그렇기 때문에 update 한 내역을 바로 보여줄려면 해당 실행구문을 비동기구문을 실행하는 곳과 같이 넣어줘야한다.

// const updatedProduct = new Product(
//   prodId,
//   updatedTitle,
//   updatedImageUrl,
//   updatedDesc,
//   updatedPrice
// );
// updatedProduct.save();
// res.redirect('/admin/products');

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  // Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err)
    })
  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log("DESTORY PRODUCT")
      res.redirect('/admin/products');
    })
    .catch(
      err => console.log(err));
};
// const prodId = req.body.productId;
// Product.deleteById(prodId);
// res.redirect('/admin/products');
