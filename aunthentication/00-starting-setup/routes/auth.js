const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
  body('email')
    .isEmail()
    .withMessage("Please enter valid email address"),
  body('password', 'Password has to be valid')
    .isLength({ min: 5 })
    .isAlphanumeric()
], authController.postLogin);

router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email')
      .custom((value, { req }) => {
        // if (value === "tet@test.com") {
        //   throw new Error("This email address...");
        // }
        // return true;
        return User.findOne({ email: email })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject(
                'E-mail exists already, please pick different one.'
                // then block 안에서 새로운 Promise 객체를 반환하고
                // express validator 현재 작업 수행될때 까지 기다려준다(비동기)
                // reject 값이 프로미스 객체에 담겨져서 반환 됐을 경우 해당 reject를 error에 담아준다.
              );
            }
          })
      }),
    body(
      'password',
      "Please enterr a password with only numbers and text and least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    })
  ],
  authController.postSignup
);
//express validator가 check안에 있는 'string' = 해당 view input의 field name에 들어온 값을 가로채서
//그것이 뒤에 붙은 메소드(isEmail)을 활용해서 체크하고 이후에 이 값은 req 객체에 담겨져서 해당 controller로 넘어간다.
//뒤에 메소드 체인을 활용해 withMessage 등을 붙이면 해당 에러 객체에 우리가 원하는 커스텀 메시지를 담아서 보내줄 수 있다.
// validator.js에서 build in된 validator를 볼 수 있다.
//custom을 체인으로 걸어서 콜백함수에 value를 넣어 주고 해당 객체 부분에 req,res 어디에 값을 체크할지를 정해줄 수 있다.
// [] 배열로 묶어서 비슷한 성격의 미들웨어끼리 묶어주기 가능
// 모든 에러 부분에서 에러 메시지를 넣는 수고를 덜고 싶다면 예를 들어 기본 Default 메시지를 두고 싶다면
// 체크하는 field string옆에 해당 메시지를 넣어주면 된다.

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;