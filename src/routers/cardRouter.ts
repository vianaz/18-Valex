import { Router } from "express";

import { CardController } from "../controllers/cardController";

export class CardRouter {
  public router: Router;
  protected cardController: CardController;

  constructor() {
    this.router = Router();
    this.cardController = new CardController();

    this.routes();
  }

  routes() {
    const router = this.router;
    const {
      activeCard,
      blockCard,
      createCard,
      deleteCard,
      visualizeAmount,
      visualizeCard,
    } = this.cardController;

    router.get("/createCard", createCard);
    router.get("/activeCard", activeCard);
    router.get("/blockCard", blockCard);
    router.get("/deleteCard", deleteCard);
    router.get("/visualizeAmount", visualizeAmount);
    router.get("/visualizeCard", visualizeCard);
  }
}
