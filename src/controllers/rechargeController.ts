import { Request, Response } from "express";
import { findCardById } from "../repositories/cardRepository";
import { insert } from "../repositories/rechargeRepository";
import { CardServices } from "../services/cardServices";
import {
  verifyIfIsBlockedCard,
  verifyIfIsExpiredCard,
} from "../utils/cardVerificationUtils";
import { errorFactoryUtils } from "../utils/errorFactoryUtils";

interface ModelParams {
  id: number;
}
class RechargeValue {
  private cardService: CardServices;

  constructor() {
    this.cardService = new CardServices();
  }
  rechargeValue = async (req: Request<ModelParams>, res: Response) => {
    const { id } = req.params;
    const { value } = req.body;

    const card = await findCardById(id);

    if (!card) {
      throw errorFactoryUtils("error_card_not_found");
    }

    const isExpiredCard = verifyIfIsExpiredCard(card);
    const isBlocked = verifyIfIsBlockedCard(card);

    if (isExpiredCard || isBlocked) {
      const errorMessage = isExpiredCard
        ? "error_expired_card"
        : "error_card_blocked";
      throw errorFactoryUtils(errorMessage);
    }

    insert({ cardId: id, amount: value });
    res.send("recharge done with success");
  };
}
export class RechargeController {
  public rechargeValue;

  constructor() {
    this.rechargeValue = new RechargeValue().rechargeValue;
  }
}
