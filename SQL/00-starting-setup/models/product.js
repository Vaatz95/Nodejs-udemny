// const db = require('../util/database');

// const Cart = require('./cart');

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       'INSERT INTO products (title, price, imageUrl, description) VALUES(?, ?, ?, ?)',
//       [this.title, this.price, this.imageUrl, this.description]
//     );
//   }

//   static deleteById(id) {

//   }

//   static fetchAll() {
//     return db.execute('SELECT * FROM products');
//   }

//   static findById(id) {
//     return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//   }
// };

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  ImageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// sql에서 직접 설정해야하는 테이블 작성 설정을 간단히 사전 정의 함으로서 실행시에 자동으로 정의해준다.

module.exports = Product;
