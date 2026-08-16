const joi = require("joi");
const { default: mongoose } = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

exports.newJoiValidation = joi.object({
  title: joi.string().required().messages({
    "string.base": "title must be string",
    "string.empty": "name is required",
  }),

  logo: joi.string().allow(null, "").messages({
    "string.base": "logo must be string",
  }),

  description: joi.string().required().messages({
    "string.base": "description must be string",
    "string.empty": "description is required",
  }),

  team: joi.string().custom(objectId).allow(null, "").messages({
    "string.base": "team must be string",
    "any.invalid": "team must be valid objectId ",
  }),

  league: joi.string().custom(objectId).allow(null, "").messages({
    "string.base": "league must be string",
    "any.invalid": "league must be valid objectId ",
  }),

  player: joi.string().custom(objectId).allow(null, "").messages({
    "string.base": "player must be string",
    "any.invalid": "player must be valid objectId ",
  }),
});
