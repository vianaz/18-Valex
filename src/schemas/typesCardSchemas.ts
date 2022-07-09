import Joi from "joi";

const types = ["groceries", "restaurant", "transport", "education", "health"];

export const typesCardSchemas = Joi.object({
  type: Joi.string().valid(types).required(),
});
