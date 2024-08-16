const mongoose = require("mongoose");
const validator = require("validator");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [50, "Name can't exceed 50 characters"],
    minLength: [3, "Name should have more than 3 characters"],
  },
  number: {
    type: String,
    required: [true, "Please enter your number"],
    maxLength: [50, "Number can't exceed 50 characters"],
    minLength: [3, "Number should have more than 3 characters"],
    unique: true, // Ensure the number field is unique
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  product: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LeadModel = mongoose.model("Lead", leadSchema);

module.exports = LeadModel;
