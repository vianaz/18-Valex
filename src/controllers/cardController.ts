import { Request, Response } from "express";
import { applyMixins } from "../mixins";
import {
  findCardById,
  TransactionTypes,
  update,
} from "../repositories/cardRepository";
import { findEmployeeById } from "../repositories/employeeRepository";
import * as paymentRepository from "../repositories/paymentRepository";
import * as rechargeRepository from "../repositories/rechargeRepository";

import { CardServices } from "../services/cardServices";
import { PaymentServices } from "../services/paymentServices";
import {
  isPasswordCorrect,
  verifyIfIsActiveCard,
  verifyIfIsBlockedCard,
  verifyIfIsExpiredCard,
} from "../utils/cardVerificationUtils";
import { errorFactoryUtils } from "../utils/errorFactoryUtils";

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
  protected cardService: CardServices;

  constructor() {
    this.cardService = new CardServices();
  }

  createCard = async (req: Request, res: Response) => {
    const { cardService } = this;
    const { cardType, employeeId }: CreateCardBody = req.body;

    const employee = await findEmployeeById(employeeId);
    const employeeHaveTypeCard = await cardService.employeeAlreadyHaveTypeCard(
      cardType,
      employeeId,
    );

    if (employee === undefined || employeeHaveTypeCard) {
      // refatorar para novo formato de erro
      const typeError = employeeHaveTypeCard
        ? "error_employee_have_type_card"
        : "employee_not_found";
      throw errorFactoryUtils(typeError);
    }

    const { cardNumber, cardCVV, cardholderName, expirationDate } =
      cardService.buildCardInfos(employee.fullName);

    cardService.insertCard({
      cardCVV,
      employeeId,
      cardholderName,
      number: cardNumber,
      type: cardType,
      expirationDate,
    });

    res.status(201).send({
      cardholderName,
      number: cardNumber,
      cvv: cardCVV,
      expirationDate,
      type: cardType,
    });
  };
}
class ActiveCard {
  protected activeService: CardServices;

  constructor() {
    this.activeService = new CardServices();
  }
  activeCard = async (
    req: Request<ReqParams, ActiveCardBody, ActiveCardBody>,
    res: Response,
  ) => {
    const { activeService } = this;
    const { id: cardId } = req.params;
    const { cvv, password } = req.body;

    await activeService.validateCardActivation(cardId, cvv);

    activeService.insertPassword(cardId, password);
    res.status(201).send("card activated with success");
  };
}
class VisualizeAmount {
  private visualizeService: PaymentServices;

  constructor() {
    this.visualizeService = new PaymentServices();
  }
  visualizeAmount = async (req: Request<ReqParams>, res: Response) => {
    const { visualizeService } = this;
    const { id } = req.params;
    const card = await findCardById(id);
    const transactions = await paymentRepository.findByCardId(id);
    const recharges = await rechargeRepository.findByCardRechargeId(id);

    if (!card) {
      throw errorFactoryUtils("error_card_not_found");
    }

    const balance = await visualizeService.calculeBalance(card);

    res.send({ balance, transactions, recharges });
  };
}
class BlockCard {
  blockCard = async (req: Request<ReqParams>, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;

    const card = await findCardById(id);

    if (!card) throw errorFactoryUtils("error_card_not_found");

    const isBlocked = verifyIfIsBlockedCard(card);
    const isExpiredCard = verifyIfIsExpiredCard(card);
    const isCorrectPassword = isPasswordCorrect(card, password);
    const isActivate = verifyIfIsActiveCard(card);

    if (isBlocked || isExpiredCard || !isCorrectPassword) {
      const errorMessage =
        (isBlocked && "error_card_blocked") ||
        (isExpiredCard && "error_expired_card") ||
        (!isCorrectPassword && "error_invalid_password");
        
      throw errorFactoryUtils(errorMessage);
    }

    update(id, { isBlocked: true });
    res.send("card blocked with success");
  };
}
class UnblockCard {
  unblockCard = async (req: Request<ReqParams>, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;

    const card = await findCardById(id);

    if (!card) throw errorFactoryUtils("error_card_not_found");

    const isBlocked = verifyIfIsBlockedCard(card);
    const isExpiredCard = verifyIfIsExpiredCard(card);
    const isCorrectPassword = isPasswordCorrect(card, password);

    if (!isBlocked || isExpiredCard || !isCorrectPassword) {
      const errorMessage =
        (!isBlocked && "error_card_unblocked") ||
        (isExpiredCard && "error_expired_card") ||
        (!isCorrectPassword && "error_invalid_password");
      throw errorFactoryUtils(errorMessage);
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
