import { Router } from "express";
import { BuyController } from "../controllers/buyController";

export class BuyRouter {
  public buyRouter: Router;
  protected buyController: BuyController;

  constructor() {
    this.buyRouter = Router();
    this.buyController = new BuyController();
    new BuildRoutes();
  }
}

class BuyRoute extends BuyRouter {
  constructor() {
    super();
    this.buildRoute();
  }

  buildRoute() {
    const cardRouter = this.buyRouter;
    const { buySomething } = this.buyController;

    cardRouter.post("/buy", buySomething);
  }
}
class BuildRoutes {
  constructor() {
    new BuyRoute();
  }
}
