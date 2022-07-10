import { Request, Response } from "express";
import { findCardById, TransactionTypes } from "../repositories/cardRepository";
import { findByCardId } from "../repositories/paymentRepository";

import {
  ActivateCardService,
  CardServices,
  CreateCardService,
} from "../services/cardServices";

interface CreateCardBody {
  cardType: TransactionTypes;
  employeeId: number;
}
interface ActiveCardBody {
  cvv: string;
  password: string;
}

interface ReqParams {
  id: number;
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

  async activeCard(
    req: Request<ReqParams, ActiveCardBody, ActiveCardBody>,
    res: Response,
  ) {
    const cardServices = new CardServices();
    const cardActiveService = new ActivateCardService();

    const { id: cardId } = req.params;
    const { cvv, password } = req.body;
    const isValidateToActive = await cardServices.validateCardActivation(
      cardId,
      cvv,
    );

    if (!isValidateToActive) {
      return res.status(409).send("card is already activated"); // mudar depois para erro customizado
    }

    cardActiveService.activateCard(cardId, password);
    res.status(200).send("card activated with success");
  }
  visualizeCard(req: Request, res: Response) {
    res.send("visualizeCard");
  }
  async visualizeAmount(req: Request<ReqParams>, res: Response) {
    const { id } = req.params;
    const transitions = await findByCardId(id);

    console.log(transitions);
    res.send("visualizeAmount");
  }
  async blockCard(req: Request<ReqParams>, res: Response) {
    const { id } = req.params;

    const cardService = new CardServices();
    const card = await findCardById(id);

    if (!card) {
      return res.status(404).send("card not found");
    }

    const isBlocked = cardService.isBlockedCard(card);
    const isExpiredCard = cardService.alreadyExpiredCard(card);

    if (isBlocked || isExpiredCard) {
      return res.status(400).send("impossibel to block card");
    }

    res.send("card blocked with success");
  }
  async unblockCard(req: Request<ReqParams>, res: Response) {
    const { id } = req.params;

    const cardService = new CardServices();
    const card = await findCardById(id);

    if (!card) {
      return res.status(404).send("card not found");
    }

    const isBlocked = cardService.isBlockedCard(card);
    const isExpiredCard = cardService.alreadyExpiredCard(card);

    if (!isBlocked || isExpiredCard) {
      return res.status(400).send("impossibel to unblock card");
    }

    res.send("card unblocked with success");
  }
}
