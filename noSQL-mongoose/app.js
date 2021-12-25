const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("61c6e19baab937e98e63650e")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
// 몽구스 때문에 몽고DB의 데이터 객체로 접근 가능하기 때문에 이제 그냥 단순하게 할당만 해줘도 된다.

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://Vaatz:Wanmo!1605@cluster0.lbfk5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Koo",
          email: 'test@test.com',
          cart: {
            items: []
          }
        })
        user.save();
      }
    })
    app.listen(3001);
  }).catch(err => {
    console.log(err);
  })