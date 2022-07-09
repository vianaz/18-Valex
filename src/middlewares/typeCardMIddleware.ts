import { Request, Response, NextFunction } from "express";
import { typesCardSchemas } from "../schemas/typesCardSchemas";

interface MiddlewareProps {
  req: Request;
  res: Response;
  next: NextFunction;
}

const typeCardMiddleware = async ({ req, res, next }: MiddlewareProps) => {
  const { typeCard } = req.body;
  const { error } = typesCardSchemas.validate(typeCard);

  if (error) {
    return res.status(400).send("Invalid typeCard");
  }

  next();
};
