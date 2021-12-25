const path = require('path');

module.exports = path.dirname(process.mainModule.filename);

// 이렇게 핼퍼 혹은 유틸 함수로 만듬으로서 우리가 path를 활용할때 직접적으로 dirName__ 이후에 ../ 등을 적어서 조합해주는게 간소화 된다.
// process.mainModule = 부모 디렉토리르 바로 끌어옴