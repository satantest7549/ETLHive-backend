const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const sendResponse = require("../../utils/sendResponse");
const UserModel = require("../../models/userModel");

const isUserAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return sendResponse(
      res,
      httpStatus.UNAUTHORIZED,
      false,
      "Please log in to access this resource."
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch the user from the database
    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      return sendError(res, httpStatus.UNAUTHORIZED, "User not found.");
    }

    // Save user inside req.user
    req.user = user; 

    next();
  } catch (error) {
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      messages.SERVER_ERROR,
      error
    );
  }
};

module.exports = isUserAuthenticated;
