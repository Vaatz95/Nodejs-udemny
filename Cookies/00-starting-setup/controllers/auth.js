exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    orders: orders,
    isAunthenticated = isLoggedIn
  });
};
// 여기서 문제점은 Cookie 값에 정말 중요한 인증 정보 관련 데이터를 넣으면
// 유저가 직접적으로 수정을 가할 수 있게된다.

//쿠키의 장점은 다른페이지에 정보를 넘겨줄 수 있다는점 그리고 유저 Tracking 기능

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true;
  res.setHeader('Set-Cookie', 'loggedIn=true; Secure HttpOnly')
  res.redirect('/');
};
//Cookie 유통기한도 설정하는게 가능
// Max-age, Expired
// Secure https로 접속했을때만 Cookie가 설정됨
// http라 설정해놓은면 browers에 있는 자바스크립트로는 해당 쿠키의 설정을 바꾸는게 불가능해짐

// 여기서 단순히 로그인 되었다는 attribute를 설정해줘도
// 우리가 원하는대로 작동하지 않는다.
// 왜냐면 req를 하고 res로 리다이렉팅 해주면서 우리가 보내 로그인 관련 정보는 사라져버리기 때문이다.


// 그렇기 때문에 이후에 controller에서 보내는 req는 우리가 이전에 로그인 관련 정보가 담겨진 req가 아니기 때문에
// 독립된 개별의 req로 여겨진다. 우리가 로그인 정보를 활용하면서 해당 req가 이전 req가 동일한 유저의 req로 인삭하게 해주기 위해서는
// Cookie 필요할거다 (?)

//현재 우리가 하는것은 로직 가장 마지막에 req를 바꾸는것(lifeCycle의 가장 끝)에 전환을 하는 것이기 때문에 의미가없다?