const Joi = require("joi");

const signupValidation = (data) => {
  const schema = {
    firstName: Joi.string().min(4).max(50).trim().required(),
    lastName: Joi.string().trim().min(4).max(50).required(),
    email: Joi.string().email().min(5).max(150).trim().required(),
    password: Joi.string().min(6).required(),
    phoneNumber: Joi.string().min(11).required(),
    role: Joi.string().required(),
  };
  return Joi.validate(data, schema);
};

module.exports = signupValidation;
