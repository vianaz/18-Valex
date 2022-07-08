import { Request, Response } from "express";

interface MethodsProps {
  req: Request;
  res: Response;
}
export class CardController {
  createCard({ req, res }: MethodsProps) {
    res.send("createCard");
  }
  activeCard({ req, res }: MethodsProps) {
    res.send("activeCard");
  }
  visualizeCard({ req, res }: MethodsProps) {
    res.send("visualizeCard");
  }
  visualizeAmount({ req, res }: MethodsProps) {
    res.send("visualizeAmount");
  }
  blockCard({ req, res }: MethodsProps) {
    res.send("blockCard");
  }
  deleteCard({ req, res }: MethodsProps) {
    res.send("deleteCard");
  }
}
