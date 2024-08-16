const validateData = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  // abortEarly: false ensures that Joi returns all errors, not just the first one.

  if (error) {
    return { valid: false, errors: error.details.map((err) => err.message) };
  }

  return { valid: true, value };
};

module.exports = { validateData };
