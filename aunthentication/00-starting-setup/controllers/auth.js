const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_user: 'bb',
    api_key: 'aa',
  }
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email = "",
      password = "",
    },
    validationErrors = []
  });
};

exports.getSignup = (req, res, next) => {
  //get 메소드를 쓰는 라우터에서 해당 req에 담겨져서
  //넘어서 flash 안에 배열로 전달된 메시지를 캐치해서
  //해당 view에 전달해주고
  //view에서 이를 기반으로 해당 내역을 랜더해준다.
  //사실 근데 react쓰면 이렇게 안할듯
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email,
      password,
      confirmPassword: '',
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        // req.flash('error', 'Invaild email or password')
        // req.flash를 통해 해당 관련 에러 메시지를 req에 담아서 보내고
        // return res.redirect('/login');
        res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput: {
            email,
            password,
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.passwrod)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              return res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            oldInput: {
              email,
              password,
            },
            validationErrors: []
          });
        }
        ).catch(err => {
          console.log(err);
          res.redirect('/login')
        })
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  //vaildationResult(req)에 현재 우리가 중간 route에서 체크한 검증 체크의 error 결과가 담겨져서 보내진다.
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
    // 422 코드는 검증 (Validate)에 실패했다는 status code
    // array 메소드는 해당 error 객체 들이 담긴 배열을 돌려준다.
  }

  // User.findOne({ email: email })
  //   .then(userDoc => {
  //     if (userDoc) {
  //       req.flash('error', 'E-mail exists already, please pick different one.')
  //       return res.redirect('/signup')
  //     }
  // return
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] }
      })
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: "shop@node-complete.com",
        subject: "Success",
        html: '<h1>Succesfully sign up</h1>',
      });
    })
    .catch(err => {
      console.log(err);
    });
};
// promise를 객체를 반환하는 bcrypt return에 다시 then을 붙여서
// 로직이 실행될때 hashedPassword 부분까지 이행되면서 생기는 오류를 방지했다.

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    // crypto는 Nodejs안에 내장되어있는 임의의 랜덤 숫자 생성기 혹은
    // 유니크키 생성기다.
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email found")
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: "shop@node-complete.com",
          subject: "Password Reset",
          html: `
            <p>you requested a password</p>
            <p>click here if u want <a href="http://localhost:3000/reset/${token}>link</a>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    })
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/new-password', {
    path: '/new-password',
    pageTitle: 'New Password',
    errorMessage: message
  });
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    $gt: Date.now(),
    _id: userId
  })
    .then(user => {
      resetUser = user;
      bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
};