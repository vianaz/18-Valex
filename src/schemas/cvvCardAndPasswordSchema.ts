import Joi from "joi";

export const cvvCardSchemas = Joi.object({
	cvv: Joi.string()
		.pattern(/^[0-9]{4}$/)
		.required(),
	password: Joi.string()
		.pattern(/^[0-9]{3}$/)
		.required(),
});
