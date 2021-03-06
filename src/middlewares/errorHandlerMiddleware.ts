/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

export function errorHandlerMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  switch (error.type) {
    case "error_employee_have_type_card":
      return res.status(409).send(error.message);

    case "employee_not_found":
      return res.status(404).send(error.message);

    case "error_active_card":
      return res.status(409).send(error.message);

    case "error_invalid_cvv":
      return res.status(401).send(error.message);

    case "error_invalid_password":
      return res.status(401).send(error.message);

    case "error_expired_card":
      return res.status(406).send(error.message);

    case "error_card_not_found":
      return res.status(404).send(error.message);

    case "error_card_blocked":
      return res.status(406).send(error.message);

    case "error_card_unblocked":
      return res.status(406).send(error.message);

    case "error_business_not_found":
      return res.status(404).send(error.message);

    case "error_business_type_different_from_card":
      return res.status(404).send(error.message);

    case "error_balance_insufficient":
      return res.status(406).send(error.message);

    default:
      break;
  }

  return res.sendStatus(500);
}
