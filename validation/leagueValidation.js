const Joi = require("joi");

const leagueJoiSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "League name is required",
    "string.min": "League name must be at least 2 characters",
    "string.max": "League name must be less than 100 characters",
  }),

  type: Joi.string()
    .valid("continental", "domestic", "international", "friendly")
    .required()
    .messages({
      "any.only": "League type is invalid",
      "string.empty": "League type is required",
    }),

  country: Joi.string().trim().min(2).max(50).optional().allow("").messages({
      "string.empty": "League type is required",
    }),


  logo: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Logo must be a valid URL",
  }),

  foundedYear: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      "number.base": "Founded year must be a number",
      "number.min": "Founded year is too old",
      "number.max": "Founded year cannot be in the future",
    }),

  startDate: Joi.date().required().messages({
    "date.base": "Start date must be a valid date",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.greater": "End date must be after start date",
    "any.required": "End date is required",
  }),

  apiId: Joi.number().required().messages({
    "number.base": "apiId must be a number",
    "any.required": "apiId is required",
  }),
});

module.exports = leagueJoiSchema;
