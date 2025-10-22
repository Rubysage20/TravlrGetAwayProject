const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const user = new User({ name: req.body.name, email: req.body.email, hash: '', salt: '' });
    user.setPassword(req.body.password);
    await user.save();

    const token = user.generateJWT();
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(400).json({ message: 'Registration failed', error: err.message });
  }
};

const login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Auth error', error: err.message });
    if (!user) return res.status(401).json(info || { message: 'Login failed' });

    const token = user.generateJWT();
    return res.status(200).json({ token });
  })(req, res, next);
};

module.exports = { register, login };
