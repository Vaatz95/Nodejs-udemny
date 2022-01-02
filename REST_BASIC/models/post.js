const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
},
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);

// 몽구스는 항상 새로운 데이터가 들어오거나 데이터가 갱신될시에
// 밑에 타임스탬프를 남기게 만들어 줄 수 있다.