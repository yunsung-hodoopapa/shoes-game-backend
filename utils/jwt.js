const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, 'password');
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // 기간 만료가 되었을 때
      console.log(error);
    }
    if (error.name === 'JsonWebTokenError') {
      // 서명이 유효하지 않거나 수정된 경우
      console.log(error);
    }
    if (error.name === 'NotBeforeError') {
      //JWT 형식이 아닌 경우
      console.log(error);
    }
    console.log(err);
    return false;
  }
};

//  access 토큰
// 유효시간은 2시간이다.
// 매 요청마다 로그인 수행을 한다. (cookie에 있는 코튼을 이용)
const makeAccessToken = (id) => {
  try {
    return jwt.sign(
      {
        id,
      },
      'password',
      {
        expiresIn: '2h',
      }
    );
  } catch (error) {
    console.log(err);
  }
};
// refresh 토큰
// 유효기간 2주
const makeRefreshToken = (id) => {
  try {
    return jwt.sign(
      {
        id,
      },
      'password',
      {
        expiresIn: '14d',
      }
    );
  } catch (error) {
    console.log(err);
  }
};

module.exports = { verifyToken, makeAccessToken, makeRefreshToken };
