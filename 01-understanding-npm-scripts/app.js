const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));



// 공통되는 css 예를 들어 main.css 같은 경우에는 public 폴더를 만들고 거기에 있는 css 파일을 적용시켜줄 수 있다.
// 하지만 이럴 경우에 통상 html에서 해주는 방식대로 하면 인지를 못하게 되고 'static'을 활용해야한다.
// 위에 처럼 static을 활용해주면 css 혹은 jss 파일을 static 경로로 찾을 경우 express에서 자동으로 앞에 public 경로를 붙여준다.

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// use를 활용하고 뒤에 디렉토리를 붙이는 경우에는 exact가 적용되지 않았기 때문에 비슷한 디렉토리도 전부 해당 middleware가 적용된다.
// 그렇기에 따로 라우터를 뺴고 앞에 get post등을 사용하면 exact가 걸리게 되고 해당 디렉토리만 middleware를 걸쳐서 적용된다.

app.listen(3000);
