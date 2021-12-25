const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');
// key value
const adminRoutes = require('./routes/admin');
// const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
// app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);

// app.set 으로 전역으로 설정을 할 수 있다.
// 전역 데이터 공유 등이나 위처럼 퍼그 엔진을 랜더로 사용하게 할 수 있다.
// 위에 처럼 view 관련 폴더들이 어디에 있는지도 정의해줄 수 있다.
// 하지만 보통 기본값으로 메인 경로에 있는 views 폴더로 정의되어 있다.