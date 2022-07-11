import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import { applyMixins } from "../mixins";

class BuyRoute {
  protected buildBuyRoute(router: Router, controller: PaymentController) {
    const { buy } = controller;
    router.post("/buy/:id", buy);
  }
}
export class PaymentRouter {
  public paymentRouter: Router;
  protected buyController: PaymentController;

  constructor() {
    this.paymentRouter = Router();
    this.buyController = new PaymentController();
    this.buildRouter();
  }
  private buildRouter() {
    this.buildBuyRoute(this.paymentRouter, this.buyController);
  }
}

export interface PaymentRouter extends BuyRoute {}
applyMixins(PaymentRouter, [BuyRoute]);
