const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const playerValidation = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "name must be string",
    "string.empty": "name is required",
  }),
  currentTeam: Joi.string().custom(objectId).required().messages({
    "string.base": "currentTeam must be string",
    "string.empty": "currentTeam is required",
    "any.invalid": "currentTeam must be a valid ObjectId",
  }),
  NationalTeam: Joi.string().custom(objectId).allow(null, "").messages({
    "string.base": "NationalTeam must be string",
    "any.invalid": "NationalTeam must be a valid ObjectId",
  }),
  position: Joi.string().required().messages({
    "string.base": "position must be string",
    "string.empty": "position is required",
  }),
  age: Joi.number().required().messages({
    "number.base": "age must be a number",
    "any.required": "age is required",
  }),
  weight: Joi.number().required().messages({
    "number.base": "weight must be a number",
    "any.required": "weight is required",
  }),
  length: Joi.number().required().messages({
    "number.base": "length must be a number",
    "any.required": "length is required",
  }),
  avatar: Joi.string().uri().allow(null, "").messages({
    "string.base": "avatar must be string",
    "string.uri": "avatar must be a valid URL",
  }),
  t_shirt: Joi.string().allow(null, "").messages({
    "string.base": "t_shirt must be string",
  }),
});

module.exports = playerValidation;
