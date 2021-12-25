const fs = require('fst');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
}

//fetchAll에 있는 로직을 외부로 빼서 helper함수를 만들어주는것

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // const p = path.join(
    //   path.dirname(process.mainModule.filename),
    //   'data',
    //   'products.json'
    // );
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      })
    });
    // 화살표 함수를 활용했기 때문에 this는 클라스를 가리키게 되는것 (?!) 일단 보류
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
    // const p = path.join(
    //   path.dirname(process.mainModule.filename),
    //   'data',
    //   'products.json'
    // );
    // fs.readFile(p, (err, fileContent) => {
    //   if (err) {
    //     cb([]);
    //   }
    //   cb(JSON.parse(fileContent));
    // });
  }
}

//위에 static fetchAll는 비동기적으로 작동하기 때문에 문제가 발생하는것 인데.
// 그렇기 때문에 저 fetchAll이 데이터를 리턴해주는게 아니라 내부에 존재하는 익명함수인
// fs.readfile내의 함수를 말하는것
// 그 함수가 데이터를 리턴하는것 뿐이기 때문에
// fetchAll만을 실행하면 fetchAll 자체는 아무것도 리턴하지 않고
// 안에 fs.readfile내의 익명함수가 데이터를 return 할뿐 fetchAll 함수가 실행되면서 동기적 작업이 아닌 비동기적 작업이기 떄문에 일어나는것 (뇌피셜)\
// 그렇기 때문에 이를 해결하기 위해서 fetchAll 함수에 임자로 callback 함수를 하나 넘겨주고 그 readfile내의 익명함수의 인자를 안에서 작업이 끝나면 실행하게 하는 방향으로 진행해야함.

// 이것을 해결 하기 위해서는 여러가지 방법이 있는데.
// 첫번째로는 인자로 콜백함수를 넘겨주는것

//class 문법을 활용해 모델을 만들어줌.
//static 메소드를 활용해 Product를 직접적으로 호출했을때만 fetch하게 해줌
