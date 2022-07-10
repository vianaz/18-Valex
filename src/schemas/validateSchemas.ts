import Joi from "joi";

const types = ["groceries", "restaurant", "transport", "education", "health"];

export const typesCardSchemas = Joi.object({
	type: Joi.string()
		.valid(...types)
		.required(),
});

export const cvvCardSchemas = Joi.object({
	cvv: Joi.string()
		.pattern(/^[0-9]{3}$/)
		.required(),
	password: Joi.string()
		.pattern(/^[0-9]{4}$/)
		.required(),
});
