import { Request, Response } from "express";
import { applyMixins } from "../mixins";
import {
  findCardById,
  TransactionTypes,
  update,
} from "../repositories/cardRepository";
import { findByCardId } from "../repositories/paymentRepository";

import { CardServices, CreateCardService } from "../services/cardServices";

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

class CreateCard {
  protected createServices: CardServices;
  protected createCardService: CreateCardService;

  constructor() {
    this.createServices = new CardServices();
    this.createCardService = new CreateCardService();
  }

  createCard = async (req: Request, res: Response) => {
    const { createServices, createCardService } = this;
    const { cardType, employeeId }: CreateCardBody = req.body;

    const employee = await createServices.findEmployee(employeeId);
    const employeeHaveTypeCard =
      await createServices.verifyEmployeeHaveTypeCard(cardType, employeeId);

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
  };
}
class ActiveCard {
  protected activeServices: CardServices;

  constructor() {
    this.activeServices = new CardServices();
  }
  activeCard = async (
    req: Request<ReqParams, ActiveCardBody, ActiveCardBody>,
    res: Response,
  ) => {
    const { activeServices } = this;
    const { id: cardId } = req.params;
    const { cvv, password } = req.body;

    const isValidateToActive = await activeServices.validateCardActivation(
      cardId,
      cvv,
    );

    if (!isValidateToActive) {
      return res.status(409).send("card is already activated"); // mudar depois para erro customizado
    }

    update(cardId, { password });
    res.status(200).send("card activated with success");
  };
}
class VisualizeAmount {
  // visualizeCard(req: Request, res: Response) {
  //   res.send("visualizeCard");
  // }
  visualizeAmount = async (req: Request<ReqParams>, res: Response) => {
    const { id } = req.params;
    const transitions = await findByCardId(id);

    console.log(transitions);
    res.send("visualizeAmount");
  };
}
class BlockCard {
  protected blockServices: CardServices;

  constructor() {
    this.blockServices = new CardServices();
  }

  blockCard = async (req: Request<ReqParams>, res: Response) => {
    const { blockServices } = this;
    const { id } = req.params;

    const card = await findCardById(id);

    if (!card) {
      return res.status(404).send("card not found");
    }

    const isBlocked = blockServices.isBlockedCard(card);
    const isExpiredCard = blockServices.alreadyExpiredCard(card);

    if (isBlocked || isExpiredCard) {
      return res.status(400).send("impossibel to block card");
    }

    update(id, { isBlocked: true });
    res.send("card blocked with success");
  };
}
class UnblockCard {
  protected unblockServices: CardServices;

  constructor() {
    this.unblockServices = new CardServices();
  }

  unblockCard = async (req: Request<ReqParams>, res: Response) => {
    const { unblockServices } = this;
    const { id } = req.params;

    const card = await findCardById(id);

    if (!card) {
      return res.status(404).send("card not found");
    }

    const isBlocked = unblockServices.isBlockedCard(card);
    const isExpiredCard = unblockServices.alreadyExpiredCard(card);

    if (!isBlocked || isExpiredCard) {
      return res.status(400).send("impossibel to unblock card");
    }

    update(id, { isBlocked: false });
    res.send("card unblocked with success");
  };
}

export class CardController {
  public createCard;
  public activeCard;
  public visualizeAmount;
  public blockCard;
  public unblockCard;

  constructor() {
    this.createCard = new CreateCard().createCard;
    this.activeCard = new ActiveCard().activeCard;
    this.visualizeAmount = new VisualizeAmount().visualizeAmount;
    this.blockCard = new BlockCard().blockCard;
    this.unblockCard = new UnblockCard().unblockCard;
  }
}

export interface CardController
  extends CreateCard,
    ActiveCard,
    VisualizeAmount,
    BlockCard,
    UnblockCard {}

applyMixins(CardController, [
  CreateCard,
  ActiveCard,
  VisualizeAmount,
  BlockCard,
  UnblockCard,
]);
