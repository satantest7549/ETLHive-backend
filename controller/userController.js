const sendResponse = require("../utils/sendResponse");
const httpStatus = require("http-status");
const messages = require("../utils/messages");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendToken = require("../utils/sendToken");
const {
  signUpSchema,
  loginSchema,
  passwordSchema,
} = require("../middleware/JOI/schemaValidate");
const { validateData } = require("../middleware/JOI/validateFunction");
const validator = require("validator");
const sendEmail = require("../services/sendEmail");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  try {
    const { valid, errors, value } = validateData(signUpSchema, req.body);

    if (!valid) {
      return sendResponse(res, httpStatus.BAD_REQUEST, false, errors);
    }

    const { name, username, password } = value;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return sendResponse(
        res,
        httpStatus.CONFLICT,
        false,
        messages.USER_EXISTS
      );
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await UserModel.create({
      name,
      username,
      password: hashedPassword,
    });

    sendToken(res, httpStatus.CREATED, user);
  } catch (error) {
    console.log("user register error:", error);
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      messages.SERVER_ERROR,
      error
    );
  }
};

const loginUser = async (req, res) => {
  try {
    const { valid, errors, value } = validateData(loginSchema, req.body);

    if (!valid) {
      return sendResponse(res, httpStatus.BAD_REQUEST, false, errors);
    }

    const { username, password } = value;

    // Example of user login
    const userExists = await UserModel.findOne({ username }).select(
      "name username password"
    );

    if (!userExists) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        false,
        messages.USER_NOT_FOUND
      );
    }

    // Password comparison
    const isPassword = await userExists.comparePassword(password);

    if (!isPassword) {
      return sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        false,
        messages.INVALID_USERNAME_PASSWORD
      );
    }

    sendToken(res, httpStatus.OK, userExists);
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      messages.SERVER_ERROR,
      error
    );
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { username, email } = req.body;

    if ((!username, !email)) {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        messages.PROVIDE_ALL_CREDENTIAL
      );
    }

    if (!validator.isEmail(email)) {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        messages.INVALID_EMAIL
      );
    }

    const userExists = await UserModel.findOne({ username });

    if (!userExists) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        false,
        messages.USER_NOT_FOUND
      );
    }

    // Generate reset token
    const resetToken = userExists.getResetPasswordToken();
    await userExists.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_BASE_URL}/reset-password/${resetToken}`;

    const message = `Your password reset link is as follows:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    await sendEmail(email, "Password Reset Request", message);

    return sendResponse(
      res,
      httpStatus.OK,
      true,
      "Reset link sent to your email."
    );
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      messages.SERVER_ERROR,
      error
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    // Hash the token provided in the URL
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find user by the token and check if the token is not expired
    const userExists = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpired: { $gt: Date.now() },
    });

    if (!userExists) {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        messages.TOKEN_EXPIRED
      );
    }

    const { valid, errors, value } = validateData(passwordSchema, req.body);

    if (!valid) {
      return sendResponse(res, httpStatus.BAD_REQUEST, false, errors);
    }

    const { password } = value;

    if (!password) {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        messages.PASSWORD_REQUIRED
      );
    }

    // Hash the new password before saving
    userExists.password = await bcrypt.hash(password, 10);
    userExists.resetPasswordToken = undefined;
    userExists.resetPasswordExpired = undefined;

    await userExists.save();

    sendResponse(res, httpStatus.OK, true, "Password reset successfully.");
  } catch (error) {
    console.log(error);
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      messages.SERVER_ERROR,
      error
    );
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
