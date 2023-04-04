const joi = require('joi');
const { emailPattern } = require('../constants/patterns');

const registerSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required().pattern(emailPattern),
  password: joi.string().required(),
});

const loginSchema = joi.object({
  email: joi.string().required().pattern(emailPattern),
  password: joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
