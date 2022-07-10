import { NextFunction, Request, Response } from "express";
import { CardServices } from "../services/cardServices";

export const apiKeyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cardServices = new CardServices();
  const apiKey = req.headers["x-api-key"] as string;

  const haveApiKey =
    (await cardServices.apiKeyVerification(apiKey)) === undefined;

  if (haveApiKey) {
    const typeError = {
      stutsCode: 401,
      message: "not exist this api key",
    };
    return res.status(typeError.stutsCode).send(typeError.message);
  }
  next();
};
