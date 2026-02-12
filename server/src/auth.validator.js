const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('(?=.*[a-z])'))   // must contain lowercase
    .pattern(new RegExp('(?=.*[A-Z])'))   // must contain uppercase
    .pattern(new RegExp('(?=.*[0-9])'))   // must contain number
    .required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema
};
