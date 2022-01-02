let io;

module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer);
    return io;
    // node js 문법에서 함수를 정의하는 방법임
  },
  getIO: () => {
    if (io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  }
};