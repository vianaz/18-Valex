import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository";
import { Employee } from "../repositories/employeeRepository";
import { CardServices, CreateCardService } from "../services/cardServices";

interface MethodsProps {
  req: Request<CreateCardBody>;
  res: Response;
}
interface CreateCardBody {
  cardType: TransactionTypes;
  employeeId: number;
}

export class CardController {
  private cardServices: CardServices;
  private createCardService: CreateCardService;

  constructor() {
    this.cardServices = new CardServices();
    this.createCardService = new CreateCardService();
  }

  async createCard({ req, res }: MethodsProps) {
    const apiKey: string = req.headers.apiKey as string;
    const { cardType, employeeId }: CreateCardBody = req.body;

    const haveApiKey =
      this.cardServices.apiKeyVerification(apiKey) === undefined;
    const isCorrectType = this.cardServices.verifyTypeCard(cardType);
    const employee = await this.cardServices.findEmployee(employeeId);
    // refatorar esses if's depois
    if (haveApiKey && isCorrectType) {
      return res.send("não existe essa api key");
    }

    if (employee === undefined) {
      return res.send("não existe esse funcionário");
    }

    this.createCardService.buildCardInfo(
      employeeId,
      cardType,
      employee.fullName,
    );
    
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
