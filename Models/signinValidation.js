const Joi = require("joi");

const signinValidation = (data) => {
  const schema = {
    email: Joi.string().email().min(5).max(150).trim().required(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(data, schema);
};

module.exports = signinValidation;
