const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter  your name"],
    maxLength: [50, "name can't exced 50 characters"],
    minLength: [3, "name should have more than 3 character"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "please enter  your username"],
    maxLength: [50, "username can't exced 50 characters"],
    minLength: [3, "username should have more than 3 character"],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
    minLength: [7, "password should be greater than 7 characters"],
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,
});

// JWT Token generate method of userSchema
userSchema.methods.getjwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_SECRET_KEY_EXPIRE,
  });
};

// compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Get Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
  //Generating Token of 16 bytes
  const resetToken = crypto.randomBytes(16).toString("hex");
  //Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpired = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
