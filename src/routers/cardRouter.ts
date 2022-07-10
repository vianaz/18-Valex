import { Router } from "express";

import { CardController } from "../controllers/cardController";
import { activeCardMiddleware } from "../middlewares/activeCardMiddleware";
import { apiKeyAndTypeMiddleware } from "../middlewares/apiKeyAndTypeMiddleware";
import { applyMixins } from "../mixins";

class CreateCardRoute {
  protected buildCreateRoute(router: Router, controller: CardController) {
    const { createCard } = controller;
    router.post("/card", apiKeyAndTypeMiddleware, createCard);
  }
}
class ActiveCardRoute {
  protected buildActiveRoute(router: Router, controller: CardController) {
    const { activeCard } = controller;
    router.post("/card/:id/active", activeCardMiddleware, activeCard);
  }
}
class VisualizeAmoutRoute {
  protected buildVisualizeRoute(router: Router, controller: CardController) {
    const { visualizeAmount } = controller;
    router.get("/card/amount/:id", visualizeAmount);
  }
}
class BlockCardRoute {
  protected buildBlockRoute(router: Router, controller: CardController) {
    const { blockCard } = controller;
    router.post("/card/:id/block", blockCard);
  }
}
class UnblockCardRoute {
  protected buildUnblockRoute(router: Router, controller: CardController) {
    const { unblockCard } = controller;
    router.post("/card/:id/unblock", unblockCard);
  }
}
export class CardRouter {
  public cardRouter: Router;
  protected cardController: CardController;

  constructor() {
    this.cardRouter = Router();
    this.cardController = new CardController();
    this.buildRouter();
  }

  buildRouter() {
    this.buildCreateRoute(this.cardRouter, this.cardController);
    this.buildActiveRoute(this.cardRouter, this.cardController);
    this.buildVisualizeRoute(this.cardRouter, this.cardController);
    this.buildBlockRoute(this.cardRouter, this.cardController);
    this.buildUnblockRoute(this.cardRouter, this.cardController);
  }
}

export interface CardRouter
  extends CreateCardRoute,
    ActiveCardRoute,
    VisualizeAmoutRoute,
    BlockCardRoute,
    UnblockCardRoute {}

applyMixins(CardRouter, [
  CreateCardRoute,
  ActiveCardRoute,
  VisualizeAmoutRoute,
  BlockCardRoute,
  UnblockCardRoute,
]);
