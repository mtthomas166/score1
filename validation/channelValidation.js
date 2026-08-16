const Joi = require("joi");

exports.createChannelSchema = Joi.object({
  name: Joi.string().trim().min(5).max(20).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 5 characters long",
    "string.max": "Name must be at most 20 characters long",
    "any.required": "Name is required",
  }),

  satellite: Joi.string().trim().min(5).max(100).required().messages({
    "string.base": "Satellite must be a string",
    "string.empty": "Satellite cannot be empty",
    "string.min": "Satellite must be at least 5 characters long",
    "string.max": "Satellite must be at most 100 characters long",
    "any.required": "Satellite is required",
  }),

  corner: Joi.string().trim().min(5).max(100).required().messages({
    "string.base": "Corner must be a string",
    "string.empty": "Corner cannot be empty",
    "string.min": "Corner must be at least 5 characters long",
    "string.max": "Corner must be at most 100 characters long",
    "any.required": "Corner is required",
  }),

  frequency: Joi.number().min(1000).max(20000).required().messages({
    "number.base": "Frequency must be a number",
    "number.min": "Frequency must be at least 1000",
    "number.max": "Frequency must be at most 20000",
    "any.required": "Frequency is required",
  }),

  polarization: Joi.string().valid("H", "V").required().messages({
    "any.only": "Polarization must be either H or V",
    "any.required": "Polarization is required",
  }),

  coding: Joi.string().trim().required().messages({
    "string.base": "Coding must be a string",
    "string.empty": "Coding cannot be empty",
    "any.required": "Coding is required",
  }),

  correction: Joi.string().trim().required().messages({
    "string.base": "Correction must be a string",
    "string.empty": "Correction cannot be empty",
    "any.required": "Correction is required",
  }),

  encryption: Joi.string().valid("FTA", "Encrypted").required().messages({
    "any.only": "Encryption must be either FTA or Encrypted",
    "any.required": "Encryption is required",
  }),

  language: Joi.string().trim().required().messages({
    "string.base": "Language must be a string",
    "string.empty": "Language cannot be empty",
    "any.required": "Language is required",
  }),
});
