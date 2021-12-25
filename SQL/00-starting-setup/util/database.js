// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: 'Wanmo!1605'
// })

// module.exports = pool.promise();
// createPool 다중의 query를 동시에 실행할 수 있게 만들어줄 수 있다.
// sql에서 promise 객체로 넘겨받고 이를 통해 callback을 무한정으로 만들어줘야 하는 수고스러움에서 벗어날 수 있다.

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Wanmo!1605',
  {
    dialect: "mysql",
    host: 'localhost'
  });

  module.exports = sequelize;
// sequelize를 활용함으로서 query문법을 사용하지 않아도 되고 자바스크립트에서 객체를 활용하는 방식으로 (문법으로) sql를 작성할수 있게된다.
// 테이블 이름 유저이름 비밀번호 {사용할려는 sql 종류 호스트 이름 }