const express = require('express');
const { check, body } = require('express-validator');
// body => req.body의 값을 체크하기 위한것

const feedController = require('../controller/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.post('/post',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

router.get('/post/:posdId', isAuth, feedController.getPost);

router.put('/post/:postId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);
// update -> 내용 갱신을 위주로 할때 사용됨.
// req.body => 갱신할 실제 데이터 값들이 담겨져 있음

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
