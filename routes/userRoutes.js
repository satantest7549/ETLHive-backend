const express = require("express");
const { registerUser, loginUser, forgotPassword, resetPassword } = require("../controller/userController");

const userRoutes = express.Router();


userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.put("/reset-password/:token", resetPassword);



module.exports = userRoutes;
