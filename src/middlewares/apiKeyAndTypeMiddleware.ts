import { NextFunction, Request, Response } from "express";
import { findByApiKey } from "../repositories/companyRepository";
import { CardServices } from "../services/cardServices";

export const apiKeyAndTypeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cardServices = new CardServices();
  const apiKey = req.headers["x-api-key"] as string;
  const { cardType } = req.body;

  const haveApiKey =
    (await cardServices.apiKeyVerification(apiKey)) === undefined;
  const isCorrectType = cardServices.verifyTypeCard(cardType);

  if (haveApiKey || !isCorrectType) {
    const typeError =
      (haveApiKey && {
        stutsCode: 401,
        message: "not exist this api key",
      }) ||
      ((!isCorrectType && {
        stutsCode: 422,
        message: "not exist this type",
      }) as { stutsCode: number; message: string });

    return res.status(typeError.stutsCode).send(typeError.message);
  }

  next();
};
