import { Request, Response } from "express";
import { insert } from "../repositories/rechargeRepository";
import { CardServices } from "../services/cardServices";

interface ModelParams {
  id: number;
}
class RechargeValue {
  private cardService: CardServices;

  constructor() {
    this.cardService = new CardServices();
  }
  rechargeValue = async (req: Request<ModelParams>, res: Response) => {
    const { cardService } = this;
    const { id } = req.params;
    const { value } = req.body;

    const card = await cardService.findCard(id);
    if (!card || card.password === null) {
      return res.status(400).send("you cannot recharge this card");
    }

    const isExpiredCard = cardService.alreadyExpiredCard(card);

    if (isExpiredCard) {
      return res
        .status(400)
        .send("you cannot recharge this card, because already expired");
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
