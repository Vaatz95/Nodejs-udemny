const { validationResult } = require('express-validator/check');
const fs = require('fs');
const path = require('path');
const post = require('../models/post');
// router 부분에서 검증을 거친 값들의 결과를 가지오기 때문에 이중으로 input 결과 값을 검증 할 수 있어서 좋다.

const Post = require('../models/post');
const User = require('../models/user');
//pagination skill은 다시 확인해봐야 하고
//React로 어떻게 구현하는지 체크해크봐야 할듯

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  // 두개 씩 가져온다는 것
  let totalItems;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    //limit => 어느 페이지 까지의 정보를 가져올지 제한을 둘 수 있음(지금 코드에서는 perPage => 현재 페이지의 내용만)
    res.status(200).json({
      message: "Fetch posts successfully",
      posts,
      totalItems,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Fail')
    error.statusCode = 422;
    throw error;
    // return res.status(422).json({
    //   message: 'Validation Fail',
    //   errors: errors.array()
    // })
  }
  if (!req.file) {
    const error = new Error('No image providede')
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  const post = new Post({
    title,
    content,
    imageUrl: imageUrl.replace("\\", "/"),
    creator: req.userId,
  });
  // await post.create({ /// })
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    //mongoose에 할당된 스키마를 체크해보면 알겠지만
    //해당 스키마 설계시에 posts 부분은 배열로 되어있고
    //이렇게 추가하면 mongoose가 알아서 해줌

    await user.save();
    res.status(201).json({
      message: "Post created Successfully",
      post: post,
      creator: { _id: user._id, name: user.name }
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post');
      error.statusCode = 404;
      throw error;
    }

    res.status(202).json({
      message: "Post fetched",
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Fail')
    error.statusCode = 422;
    throw error;
  }

  const { image } = req.body;
  let imageUrl = image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("no file picked");
    error.statusCode = 422;
    throw error;
  }
  // Post.findByIdAndUpdate(postId, req.body, {new: true})
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized')
      error.statusCode = 403;
      throw error;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    res.status(200).json({
      message: 'Post updated',
      post: result,
    })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized')
      error.statusCode = 403;
      throw error;
    }
    //check logged in user
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    //mongoose, mongodb query method임
    await user.save();
    res.status(200).json({
      message: "Delete Complete"
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
}
// 위에 헬퍼 코드는 기존의 이미지와 연결되어 있는 url을 제거해준다.
