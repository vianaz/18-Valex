import { Request, Response } from "express";

interface MethodsProps {
  req: Request;
  res: Response;
}

export class RechargeController {
  addValue({ req, res }: MethodsProps) {
    res.send("addValue");
  }
}
