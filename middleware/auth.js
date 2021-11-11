const { User } = require('../schemas/user');

let auth = async (req, res, next) => {
  let token = req.cookies.x_auth;

  User.findByToken(token, (err, user) => {
    if (err) {
      console.log('error');
      throw err;
    }
    if (!user) {
      return res.json({ isAuth: false, error: true });
    }
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
