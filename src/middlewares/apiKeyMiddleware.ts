import { NextFunction, Request, Response } from "express";
import { findByApiKey } from "../repositories/companyRepository";

export const apiKeyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"] as string;
  const apiKeyQuery = await findByApiKey(apiKey);

  if (apiKeyQuery === undefined) {
    const typeError = {
      stutsCode: 401,
      message: "not exist this api key",
    };
    return res.status(typeError.stutsCode).send(typeError.message);
  }
  next();
};
