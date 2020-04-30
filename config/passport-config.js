const { Strategy, ExtractJwt } = require("passport-jwt");

const secret = process.env.SECRET || "secret!?";

const User = require("../models/User");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

module.exports = (passport) => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id)
        .then((user) => {
          if (user) {
            return done(null, {
              id: user.id,
              name: user.name,
              email: user.email,
              pictureUrl: user.pictureUrl,
            });
          }
          return done(null, false);
        })
        .catch((err) => console.error(err));
    })
  );
};
