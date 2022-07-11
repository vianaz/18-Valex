import { Request, Response } from "express";
import { findById } from "../repositories/businessRepository";
import { findCardById } from "../repositories/cardRepository";
import { insert } from "../repositories/paymentRepository";
import { CardServices } from "../services/cardServices";
import { PaymentServices } from "../services/paymentServices";

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
      (!paymentService.verifyIfIsSignUpCard(card) && "sign up") ||
      (!paymentService.verifyIfIsActiveCard(card) && "active card") ||
      (paymentService.verifyIfIsExpiredCard(card) && "expired card") ||
      (paymentService.verifyIfIsBlockedCard(card) && "blocked card") ||
      (!paymentService.isPasswordCorrect(card, password) && "password wrong") ||
      (!paymentService.isBussiness(businessId) && "bussines") ||
      (!paymentService.isBussinesTypeEqualCardType(business, card) && "type") ||
      (!(await paymentService.isBalanceEnough(card, amount)) && "balance");

    if (verifyValidation) {
      return res.status(400).send(verifyValidation);
    }
    insert({ cardId, amount, businessId });
    res.send("buy with success");
  };
}

export class PaymentController {
  public buy;
  constructor() {
    this.buy = new Buy().buySomething;
  }
}
