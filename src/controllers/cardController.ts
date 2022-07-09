import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository";
import { Employee } from "../repositories/employeeRepository";
import { CardServices, CreateCardService } from "../services/cardServices";

interface CreateCardBody {
  cardType: TransactionTypes;
  employeeId: number;
}

// tentar enteder porque o constructor não tá funcionando
export class CardController {
  async createCard(req: Request, res: Response) {
    const cardServices = new CardServices();
    const createCardService = new CreateCardService();

    const apiKey = req.headers["x-api-key"] as string;
    const { cardType, employeeId }: CreateCardBody = req.body;

    const employee = await cardServices.findEmployee(employeeId);
    const employeeHaveTypeCard = await cardServices.verifyEmployeeHaveTypeCard(
      cardType,
      employeeId,
    );

    // refatorar esses if's depois
    if (employee === undefined || employeeHaveTypeCard) {
      // refatorar para novo formato de erro
      const typeError =
        (employee === undefined && {
          stutsCode: 404,
          message: "not exist this employee",
        }) ||
        (employeeHaveTypeCard && {
          stutsCode: 409,
          message: "employee have this type",
        });

      return res.status(typeError.stutsCode).send(typeError.message);
    }

    createCardService.buildCardInfo(employeeId, cardType, employee.fullName);
    res.status(201).send("card created with success");
  }

  activeCard(req: Request, res: Response) {
    res.send("activeCard");
  }
  visualizeCard(req: Request, res: Response) {
    res.send("visualizeCard");
  }
  visualizeAmount(req: Request, res: Response) {
    res.send("visualizeAmount");
  }
  blockCard(req: Request, res: Response) {
    res.send("blockCard");
  }
  deleteCard(req: Request, res: Response) {
    res.send("deleteCard");
  }
}
