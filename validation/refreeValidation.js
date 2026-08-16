const Joi = require("joi");
const mongoose = require("mongoose");

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const refereeJoiSchema = Joi.object({
  name: Joi.string().trim().max(50).required().messages({
    "string.empty": "Name is required",
    "string.max": "Name must be at most 50 characters",
  }),
  age: Joi.number().min(18).max(55).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Referee must be at least 18 years old",
    "number.max": "Referee age must be at most 55 years old",
    "any.required": "Age is required",
  }),
  avatar: Joi.string().uri().allow(null, "").messages({
    "string.base": "avatar must be string",
    "string.uri": "avatar must be a valid URL",
  }),
  type: Joi.string().trim().required().messages({
    "string.empty": "Type of referee is required",
  }),
  country: Joi.string()
    .custom(objectIdValidator, "ObjectId Validation")
    .allow(null),
  birthDate: Joi.date().allow(null),
  sex: Joi.string().valid("male", "female").default("male"),
  isInternational: Joi.boolean().default(false),
});

module.exports = refereeJoiSchema;
