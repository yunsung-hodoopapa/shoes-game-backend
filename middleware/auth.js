const { User } = require('../schemas/user');

let auth = (req, res, next) => {
  let token = req.cookies.x_auth;

  User.findByToken(token, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      return res.josn({ isAuth: false, error: true });
    }
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
