const passport = require('passport');

exports.authenticate = passport.authenticate('jwt', { session: false });

exports.optionalAuthenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
};