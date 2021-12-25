const express = require('express');

const app = express();

// app.use('/', (req, res, next) => {
//   console.log("First");
//   next();
// });

// app.use((req, res, next) =>{
//   console.log("Second");
//   res.send('<p>Assignment solved (almost)!!</p>');
// });

app.use('/users', (req, res, next) => {
  console.log('/users middleware');
  res.send('<p>The middleware that handle this shit for /users</p>');
});

app.use('/', (req, res, next) => {
  console.log('/middlewara');
  res.send('<p>The middleware that handle this shit</p>');
});


app.listen(3000);
