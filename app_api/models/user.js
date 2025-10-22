const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  name:  { type: String, required: true },
  hash:  { type: String, required: true },
  salt:  { type: String, required: true }
});

userSchema.methods.setPassword = function setPassword(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function validatePassword(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.validPassword = function (password) {
  return this.validatePassword(password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = mongoose.model('User', userSchema);

