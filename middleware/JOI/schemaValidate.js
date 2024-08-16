const Joi = require("joi");

const signUpSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name should be a type of 'text'.",
    "string.empty": "Name cannot be an empty field.",
    "any.required": "Name is a required field.",
  }),
  username: Joi.string().required().messages({
    "string.base": "Username should be a type of 'text'.",
    "string.empty": "Username cannot be an empty field.",
    "any.required": "Username is a required field.",
  }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{7,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 7 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).",
      "string.empty": "Password cannot be an empty field.",
      "any.required": "Password is a required field.",
    }),
});

// Define the login validation schema
const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.base": "Username should be a type of 'text'.",
    "string.empty": "Username cannot be an empty field.",
    "any.required": "Username is a required field.",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password should be a type of 'text'.",
    "string.empty": "Password cannot be an empty field.",
    "any.required": "Password is a required field.",
  }),
});

const passwordSchema = Joi.object({
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{7,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 7 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).",
      "string.empty": "Password cannot be an empty field.",
      "any.required": "Password is a required field.",
    }),
});

const leadSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  number: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  product: Joi.array().items(Joi.string()).optional(),
});

const leadUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  number: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  product: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  signUpSchema,
  loginSchema,
  passwordSchema,
  leadSchema,
  leadUpdateSchema,
};
