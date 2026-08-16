const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = Joi.string()
  .custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  })
  .messages({
    "any.invalid": "Must be a valid MongoDB ObjectId",
    "string.base": "Value must be a string",
    "string.empty": "Value cannot be empty",
  });

const detailsJoiSchema = Joi.object({
  match: objectId.required().messages({
    "any.required": "Match is required",
  }),

  league: objectId.required().messages({
    "any.required": "League is required",
  }),

  stadium: objectId.allow(null, "").optional(),

  round: Joi.string().trim().min(1).required().messages({
    "string.base": "Round must be a string",
    "string.empty": "Round cannot be empty",
    "any.required": "Round is required",
  }),

  channel: objectId.allow(null, "").optional(),

  referee: objectId.allow(null, "").optional(),
  commentator: objectId.allow(null, "").optional(),

  date: Joi.date().required().messages({
    "date.base": "Date must be a valid date",
    "any.required": "Date is required",
  }),

  matchTime: Joi.date().required().messages({
    "date.base": "Match time must be a valid date",
    "any.required": "Match time is required",
  }),

  status: Joi.string()
    .valid("scheduled", "live", "finished", "postponed", "cancelled")
    .default("scheduled")
    .messages({
      "any.only":
        "Status must be one of: scheduled, live, finished, postponed, cancelled",
      "string.base": "Status must be a string",
    }),

  apiId: Joi.number().required().messages({
    "number.base": "API ID must be a number",
    "any.required": "API ID is required",
  }),
});

module.exports = detailsJoiSchema;
