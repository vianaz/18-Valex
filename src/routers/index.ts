import { Router } from "express";
import { BuyRouter } from "./buyRouter";

import { CardRouter } from "./cardRouter";
import { RechargeRouter } from "./rechargeRouter";

export class Routers {
  public router: Router;
  protected cardRouter: Router;
  protected buyRouter: BuyRouter;
  protected rechargeRouter: Router;

  constructor() {
    this.router = Router();
    this.cardRouter = new CardRouter().cardRouter;
    this.rechargeRouter = new RechargeRouter().rechargeRouter;
    // this.buyRouter = new BuyRouter();

    this.buildRoutes();
  }

  buildRoutes() {
    const { router, cardRouter, rechargeRouter } = this;
    router.use(cardRouter);
    router.use(rechargeRouter);
    // router.use(buyRouter);
  }
}
