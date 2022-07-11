import { Router } from "express";

import { CardRouter } from "./cardRouter";
import { PaymentRouter } from "./paymentRouter";
import { RechargeRouter } from "./rechargeRouter";

export class Routers {
  public router: Router;
  protected cardRouter: Router;
  protected paymentRouter: Router;
  protected rechargeRouter: Router;

  constructor() {
    this.router = Router();
    this.cardRouter = new CardRouter().cardRouter;
    this.rechargeRouter = new RechargeRouter().rechargeRouter;
    this.paymentRouter = new PaymentRouter().paymentRouter;

    this.buildRoutes();
  }

  buildRoutes() {
    const { router, cardRouter, rechargeRouter, paymentRouter } = this;
    router.use(cardRouter);
    router.use(rechargeRouter);
    router.use(paymentRouter);
  }
}
