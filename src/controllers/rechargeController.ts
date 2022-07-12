import { Request, Response } from "express";
import { find, findCardById } from "../repositories/cardRepository";
import { insert } from "../repositories/rechargeRepository";
import { CardServices } from "../services/cardServices";
import {
  verifyIfIsBlockedCard,
  verifyIfIsExpiredCard,
} from "../utils/cardVerificationUtils";

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
      return res.status(409).send("card not found");
    }

    const isExpiredCard = verifyIfIsExpiredCard(card);
    const isBlocked = verifyIfIsBlockedCard(card);

    if (isExpiredCard || isBlocked) {
      const errorMessage = isExpiredCard
        ? "this card is expired"
        : "this card is blocked";
      return res.status(400).send(errorMessage);
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
