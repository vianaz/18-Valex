import { Request, Response } from "express";
import { CardServices } from "../services/cardServices";

interface MethodsProps {
  req: Request;
  res: Response;
}
export class CardController {
  protected cardServices: CardServices;

  constructor() {
    this.cardServices = new CardServices();
  }

  createCard({ req, res }: MethodsProps) {
    const apiKey: string = req.body.apiKey;
    const haveApiKey = this.cardServices.apiKeyVerification(apiKey);

    if (haveApiKey) {
      return res.send("não existe essa api key");
    }
    
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
