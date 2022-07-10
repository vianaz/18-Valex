import { Router } from "express";
import { BuyController } from "../controllers/buyController";

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
export class BuyRouter {
  public buyRouter: Router;
  protected buyController: BuyController;

  constructor() {
    this.buyRouter = Router();
    this.buyController = new BuyController();
    new BuildRoutes();
  }
}
