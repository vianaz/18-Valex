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
import { errorFactoryUtils, ErrorTypes } from "../utils/errorFactoryUtils";

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

    const verifyValidation: ErrorTypes =
      (!verifyIfIsSignUpCard(card) && "error_card_not_found") ||
      (!verifyIfIsActiveCard(card) && "error_active_card") ||
      (verifyIfIsExpiredCard(card) && "error_expired_card") ||
      (verifyIfIsBlockedCard(card) && "error_card_blocked") ||
      (!isPasswordCorrect(card, password) && "error_invalid_password") ||
      (!paymentService.isBussiness(businessId) && "error_business_not_found") ||
      (!paymentService.isBussinesTypeEqualCardType(business, card) &&
        "error_business_type_different_from_card") ||
      (!((await paymentService.calculeBalance(card)) >= amount) &&
        "error_balance_insufficient");

    if (verifyValidation) {
      throw errorFactoryUtils(verifyValidation);
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
