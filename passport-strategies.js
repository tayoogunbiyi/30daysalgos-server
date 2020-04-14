var passport = require("passport");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("User");

module.exports = function () {
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      async function (accessToken, refreshToken, profile, done) {
        //console.log('Recived valid access token!');
        try {
          const user = await User.createSocialUser(accessToken, profile);
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};
