const Joi = require("joi");
const mongoose = require("mongoose");

const stadiumValidation = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),

  numberOfSeats: Joi.number().integer().min(1).required().messages({
    "number.base": "Number of seats must be a number",
    "number.min": "Number of seats must be at least 1",
    "any.required": "Number of seats is required",
  }),

  dateOfCreation: Joi.date().optional().messages({
    "date.base": "Date of creation must be a valid date",
  }),

  country: Joi.string().trim().required().messages({
    "string.base": "Country must be a string",
    "string.empty": "Country is required",
    "any.required": "Country is required",
  }),

  location: Joi.string().trim().required().messages({
    "string.base": "Location must be a string",
    "string.empty": "Location is required",
    "any.required": "Location is required",
  }),

  length: Joi.string().trim().required().messages({
    "string.base": "Length must be a string",
    "string.empty": "Length is required",
    "any.required": "Length is required",
  }),

  width: Joi.number().min(1).required().messages({
    "number.base": "Width must be a number",
    "number.min": "Width must be at least 1",
    "any.required": "Width is required",
  }),

  team: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Team must be a valid ObjectId");
      }
      return value;
    })
    .optional(),

  nationalTeam: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("National team must be a valid ObjectId");
      }
      return value;
    })
    .optional(),
});

module.exports = stadiumValidation;
