const Joi = require("joi");
const mongoose = require("mongoose");  

const teamValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "name is required",
    "string.empty": "name is required",
  }),

  logo: Joi.string().allow("", null),

  information: Joi.object({
    achievements: Joi.array().items(Joi.string()).default([]),
    country: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .messages({
        "any.invalid": "country must be a valid ObjectId",
      }),

    level: Joi.string().allow("", null),

    stadium: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .messages({
        "any.invalid": "stadium must be a valid ObjectId",
      }),

    federation: Joi.string().allow("", null),

    description: Joi.string().allow("", null),
  }).required(),

  coach: Joi.array()
    .items(
      Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.invalid": "coach must be valid ObjectIds",
        }),
    )
    .default([]),

  apiId: Joi.number().required().messages({
    "any.required": "apiId is required",
    "number.base": "apiId must be a number",
  }),
});

module.exports = { teamValidationSchema };
