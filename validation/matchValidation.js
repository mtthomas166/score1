const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

exports.matchJoiValidation = Joi.object({
  apiId: Joi.number().required().messages({
    "number.base": "apiId must be a number",
    "any.required": "apiId is required",
  }),

  homeTeam: Joi.string().custom(objectId).required().messages({
    "string.base": "homeTeam must be a string",
    "any.required": "homeTeam is required",
    "any.invalid": "homeTeam must be a valid ObjectId",
  }),

  awayTeam: Joi.string().custom(objectId).required().messages({
    "string.base": "awayTeam must be a string",
    "any.required": "awayTeam is required",
    "any.invalid": "awayTeam must be a valid ObjectId",
  }),

  league: Joi.string().custom(objectId).required().messages({
    "string.base": "league must be a string",
    "any.required": "league is required",
    "any.invalid": "league must be a valid ObjectId",
  }),

  matchDate: Joi.date().required().messages({
    "date.base": "matchDate must be a valid date",
    "any.required": "matchDate is required",
  }),

  homeTeamGoals: Joi.number().min(0).default(0).messages({
    "number.base": "homeTeamGoals must be a number",
    "number.min": "homeTeamGoals cannot be negative",
  }),

  awayTeamGoals: Joi.number().min(0).default(0).messages({
    "number.base": "awayTeamGoals must be a number",
    "number.min": "awayTeamGoals cannot be negative",
  }),

  status: Joi.string()
    .valid("scheduled", "live", "finished", "postponed", "cancelled")
    .default("scheduled")
    .messages({
      "any.only":
        "status must be one of: scheduled, live, finished, postponed, cancelled",
      "string.base": "status must be a string",
    }),

  currentMinute: Joi.number().min(0).max(130).default(0).messages({
    "number.base": "currentMinute must be a number",
    "number.min": "currentMinute cannot be less than 0",
    "number.max": "currentMinute cannot be greater than 130",
  }),

  currentSecond: Joi.number().min(0).max(59).default(0).messages({
    "number.base": "currentSecond must be a number",
    "number.min": "currentSecond cannot be less than 0",
    "number.max": "currentSecond cannot be greater than 59",
  }),

  lastUpdated: Joi.date().default(Date.now).messages({
    "date.base": "lastUpdated must be a valid date",
  }),
});
