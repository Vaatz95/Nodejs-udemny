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
  const product = new Product({ title, price, description, imageUrl, userId: req.user });
  // req.user._id로 해도 되지만 mongoose를 사용할 경우에는 그냥 유저 객체를 넘겨주면 몽구스가 알아서 id를 뽑아간다. (Schema를 그렇게 짰으니)
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId).then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save();
  }).then(result => {
    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  })
    .catch(err => console.log(err));
};
// 몽구스 덕분에 이제 몽구스 관련 실행 문안에서
// save를 실행할 경우 몽고DB 객체에 접근해서
// 완전 새로운 값을 대체해서 넣는게 아니라
// 달라진 변화만 체크되서 저장된다.
// 참고로 여기에 save도 몽구스 내장 메소드다.

exports.getProducts = (req, res, next) => {
  Product.find()
  // .select('title price -_id')
  // 필요한 데이터만 select해서 가져올 수 있다.
    // .populate('userId', 'name')
    // populate도 두번째 인자로 가져오고 싶은 데이터만 패칭 받을 수 있다.
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};
// 해당 product를 불러오면 product와 단순히 해당 유저의 id값만 받아오는데
// 만약 우리가 userid 값 이외에 해당 연관된 데이터 전체를 패칭받고 싶다면
// populate를 활용해서
// 해당 데이터 전체를 복사해서 가져올 수 있다.

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
// 몽구스 내장 메소드로 간단하게 찾아서 삭제가 가능해짐
