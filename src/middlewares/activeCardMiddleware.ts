import { NextFunction, Request, Response } from "express";

import { cvvCardSchemas } from "../schemas/validateSchemas";

export const activeCardMiddleware = async (
	req: Request<{id: number}>,
	res: Response,
	next: NextFunction,
) => {
	const { error } = cvvCardSchemas.validate(req.body);

	if (error) {
		return res.status(422).send({ error });
	}

	next();
};
