const Joi = require("joi");

const coachValidation = Joi.object({
  name: Joi.string().min(5).max(20).trim().required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 5 characters",
    "string.max": "Name must be at most 20 characters",
  }),

  avatar: Joi.string().uri().trim().allow(null, ""),

  team: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .allow(null, "")
    .messages({
      "string.pattern.base": "Team must be a valid MongoDB ObjectId",
    }),

  state: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .allow(null, "")
    .messages({
      "string.pattern.base": "State must be a valid MongoDB ObjectId",
    }),

  birthDate: Joi.date().allow(null, ""),
});

module.exports = coachValidation;
