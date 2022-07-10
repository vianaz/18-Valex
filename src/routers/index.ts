import { Router } from "express";
import { BuyRouter } from "./buyRouter";

import { CardRouter } from "./cardRouter";
import { RechargeRouter } from "./rechargeRouter";

export class Routers {
  public router: Router;
  protected cardRouter: CardRouter;
  protected buyRouter: BuyRouter;
  protected rechargeRouter: RechargeRouter;

  constructor() {
    this.router = Router();
    this.cardRouter = new CardRouter();
    // this.buyRouter = new BuyRouter();
    // this.rechargeRouter = new RechargeRouter();

    this.buildroutes();
  }

  buildroutes() {
    const router = this.router;
    const { cardRouter } = this.cardRouter;
    // const { buyRouter } = this.buyRouter;
    // const { rechargeRouter } = this.rechargeRouter;

    router.use(cardRouter);
    // router.use(buyRouter);
    // router.use(rechargeRouter.router);
  }
}
