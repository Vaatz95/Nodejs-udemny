const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const feedRoutes = require('./router/feed');
const authRoutes = require('./router/auth');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()) //x-www-form-urlencoded
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter }).single('image')
);
app.use("/images", express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next();
  // 3번째 같은 경우에는 특정 토큰이 있어야 해당 API 접근이 가능하도록 만들어 줄 수 있는거 같다.
});
// 다른 도메인의 클라이언트에서 api 요청을 했을 경우
// 특정 헤더 설정을 해주지 않으면 보안상의 이유로 서버 족에서
// CORS 에러가 발생한다.
// 이러한 문제를 해결하기 위해서는 위에 처럼 미들웨어를 활용해
// 서버 쪽에서 헤더를 설정하면 해결해 줄 수 도 있다.

//POST를 메소드를 활용하면 요청이 2개가 가는데
//200 요청이 적힌 이 요청은 먼저 사전에 해당 POST 메소드가 적힌 것을 보내 처음에 POST가 먹히는지 확인하는것이다

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode;
  const message = err.message;
  const data = err.data;
  res.status(status).json({
    message,
    data,
  });
});

mongoose.connect('mongodb+srv://Vaatz:Wanmo!1605@cluster0.jr4rh.mongodb.net/messages')
  .then(result => {
    app.listen(8080);
    console.log('connectd');
  })
  .catch(err => console.log(err))
