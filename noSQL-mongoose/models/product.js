const moogoose = require('mongoose');

const Schema = moogoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
// ref를 활용함으로서 몽고DB 안에 무슨 데이터와 연관이 있는지를 전달해줄 수 있다.
// 데이터 관계를 명시해줄수 있다는것

module.exports = moogoose.model('Product', productSchema);
//model을 통해 작성해놓은 schema와 연동된다.
//moogoose에서 자동으로 해당 string 값을 소문자화 시키고 복수형으로 전환해서
//db에 collection이름으로 사용한다.

// mongodb의 장점은 Schema가 없는거지만
// 우리가 작업을 할때마다 특정 구조가 필요한 경우가 많으므로
// 몽구스에서는 일종의 청사진을 만들어 그에 따른 이점을 취하고
// 우리가 데이터 작성에만 집중하도록 도와주는 것이다.
// 유연성으 원한다면 굳이 스키마를 작성하지 않아도 가능하다.

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this })
//       // 단순하게 this로 교체하는 방식을 사용하면 안되고 $set을 활용해서
//       // 해당 데이터 베이스에 있는 값과 현재 집어넣주는 값을 비교해서 
//       // $set에 있는 값으로 최신화 해준다.
//       // field을 정해서 그 부분만 바꿔 줄 수 도 있다.
//     } else {
//       dbOp = db
//         .collection('products')
//         .insertOne(this)
//     }
//     return dbOp
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       })
//       .catch(err => {
//         console.log(err)
//       });
//   }

//   // mongodb의 메소드인 find를 사용하면 youtubeviewer에서 nextpagetoken과 같이 다음 관련 데이터로 넘어갈 수 있는 일종의 토큰 같은게 주어진다.
//   // toArray를 활용해 document(mongodb 안에 데이터)들을 자바스크립트 배열로 나오게 할 수 있다.

//   static findById(prodId) {
//     const db = getDb();
//     return db.collection('products')
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then(product => {
//         console.log(product);
//         return product;
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }
//   // mongodb의 id 타입은 bson 혹은 객체로 저장된다.
//   // 그렇기 때문에 위에 처럼 new mongodb.ObjectId를 활용해서 id 값을 db에 저장되는것과 동일한 형식으로 만들어줘야한다.
//   // next를 활용해 find로 찾은 커서를 next로 해서 해당 document값을 뽑아낸다.
//   static deleteById(prodId) {
//     const db = getDb();
//     return db.collection('products')
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(result => {
//         console.log("DELETE")
//       })
//       .catch((err) => console.log(err))
//   }
// }

// module.exports = Product;
