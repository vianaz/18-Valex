import { NextFunction, Request, Response } from "express";
import { findByApiKey } from "../repositories/companyRepository";

interface MiddlewareProps {
  req: Request;
  res: Response;
  next: NextFunction;
}

const apiKeyMiddleware = async ({ req, res, next }: MiddlewareProps) => {
  const apiKey = req.headers["x-api-key"] as string;
  findByApiKey(apiKey);
};
