const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not Authenticated');
    error.status = 401;
    throw error;
  }
  
  const token = authHeader.split('')[1];
  let decodedToken;
  //req.get() => 해당 인식자를 가진 부분에 정보 혹은 데이터를 가지고 온다.
  try {
    decodedToken = jwt.verify(token, 'secret')
  } catch (err) {
    err.status = 500;
    throw err;
  }
  if (!decodedToken) {
    new error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken;
  next();
}