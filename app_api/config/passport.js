const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        // Normalize only for lookup
        const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).exec();
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const ok = user.validPassword(password);
        if (!ok) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
