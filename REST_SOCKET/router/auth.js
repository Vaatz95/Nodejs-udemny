const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const User = require('../models/user');
const authController = require('../controller/user');
const isAuth = require('../middleware/is-auth');

router.put('/singup', [
  body('email').isEmail().withMessage("Please Enter a valid Email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('Email address already exists');
        }
      });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 }),
  body('name')
    .trim()
    .not()
    .isEmpty()
], authController.signup
);

router.post('/login', authController.login);
//put은 용도에 대해서는 좀 더 생각해봐야한다.
//신규 데이터나 기존의 데이터를 덮어쓰는..

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth, [
  body('status')
    .trim()
    .not
    .isEmpty()
], authController.updateUserStatus);

module.router = router;