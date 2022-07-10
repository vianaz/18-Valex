import { Request, Response } from "express";

interface MethodsProps {
  req: Request;
  res: Response;
}

export class BuyController {
	buySomething({ req, res }: MethodsProps) {
		res.send("buySomething");
	}
}
