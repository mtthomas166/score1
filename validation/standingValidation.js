const Joi = require("joi");
const mongoose = require("mongoose");

const standingValidation = Joi.object({
  league: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("League must be a valid ObjectId");
      }
      return value;
    })
    .messages({
      "string.base": "League must be a string",
      "string.empty": "League is required",
      "any.required": "League is required",
    }),

  team: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Team must be a valid ObjectId");
      }
      return value;
    })
    .messages({
      "string.base": "Team must be a string",
      "string.empty": "Team is required",
      "any.required": "Team is required",
    }),

  playedGames: Joi.number().integer().min(0).optional().messages({
    "number.base": "Played games must be a number",
    "number.min": "Played games cannot be negative",
  }),

  won: Joi.number().integer().min(0).optional().messages({
    "number.base": "Won must be a number",
    "number.min": "Won cannot be negative",
  }),

  draw: Joi.number().integer().min(0).optional().messages({
    "number.base": "Draw must be a number",
    "number.min": "Draw cannot be negative",
  }),

  lost: Joi.number().integer().min(0).optional().messages({
    "number.base": "Lost must be a number",
    "number.min": "Lost cannot be negative",
  }),

  points: Joi.number().integer().min(0).optional().messages({
    "number.base": "Points must be a number",
    "number.min": "Points cannot be negative",
  }),

  goalsFor: Joi.number().integer().min(0).optional().messages({
    "number.base": "Goals for must be a number",
    "number.min": "Goals for cannot be negative",
  }),

  goalsAgainst: Joi.number().integer().min(0).optional().messages({
    "number.base": "Goals against must be a number",
    "number.min": "Goals against cannot be negative",
  }),

  goalDifference: Joi.number().integer().optional().messages({
    "number.base": "Goal difference must be a number",
  }),
});

module.exports = standingValidation;
