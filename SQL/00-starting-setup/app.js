const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user === user;
      next();
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: 'Koo',
        email: 'test@gamail.com'
      });
    }
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
// force는 단지 개발 중에 새로운 데이타 형식을 적용했을 경우 기존에 만들어 놓은 예전 형식의 데이터 테이블을 삭제하고 새로운 형식으로 갱신하기 위해 필요한 것이다. (production 단계에서는 필요없음)
//sync를 사용함으로서 해당 이름의 테이블이 없을 경우 우리가 설정해놓은 테이블 설정대로 새로운 테이블을 자동으로 생성해준다.
