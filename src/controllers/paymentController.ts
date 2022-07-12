import { Request, Response } from "express";
import { findById } from "../repositories/businessRepository";
import { findCardById } from "../repositories/cardRepository";
import { insert } from "../repositories/paymentRepository";
import { CardServices } from "../services/cardServices";
import { PaymentServices } from "../services/paymentServices";
import {
  isPasswordCorrect,
  verifyIfIsActiveCard,
  verifyIfIsBlockedCard,
  verifyIfIsExpiredCard,
  verifyIfIsSignUpCard,
} from "../utils/cardVerificationUtils";

interface IParams {
  id: number;
}
interface IBody {
  password: string;
  amount: number;
  businessId: number;
}

class Buy {
  private cardService: CardServices;
  private paymentService: PaymentServices;

  constructor() {
    this.paymentService = new PaymentServices();
    this.cardService = new CardServices();
  }
  buySomething = async (req: Request<IParams, any, IBody>, res: Response) => {
    const { paymentService } = this;
    const { id: cardId } = req.params;
    const { amount, password, businessId } = req.body;
    const card = await findCardById(cardId);
    const business = await findById(businessId);

    const verifyValidation =
      (!verifyIfIsSignUpCard(card) && "card don't found") ||
      (!verifyIfIsActiveCard(card) && "please, active your card") ||
      (verifyIfIsExpiredCard(card) && "this card is expired") ||
      (verifyIfIsBlockedCard(card) && "this card is blocked") ||
      (!isPasswordCorrect(card, password) && "your password is wrong") ||
      (!paymentService.isBussiness(businessId) && "business don't found") ||
      (!paymentService.isBussinesTypeEqualCardType(business, card) &&
        "you just can use your card when business type is the same of your card") ||
      (!((await paymentService.calculeBalance(card)) >= amount) &&
        "your balance is not enough");

    if (verifyValidation) {
      return res.status(400).send(verifyValidation);
    }
    insert({ cardId, amount, businessId });
    res.send("ok");
  };
}

export class PaymentController {
  public buy;
  constructor() {
    this.buy = new Buy().buySomething;
  }
}
