/* eslint-disable @typescript-eslint/no-empty-interface */
import { Router } from "express";
import { RechargeController } from "../controllers/rechargeController";
import { apiKeyMiddleware } from "../middlewares/apiKeyMiddleware";
import { applyMixins } from "../mixins";

class RechargeRoute {
  builRechargedRoute(router: Router, controller: RechargeController) {
    const { rechargeValue } = controller;
    router.post("/recharge/:id", apiKeyMiddleware, rechargeValue);
  }
}
export class RechargeRouter {
  public rechargeRouter: Router;
  protected rechargeController: RechargeController;

  constructor() {
    this.rechargeRouter = Router();
    this.rechargeController = new RechargeController();
    this.buildRoutes();
  }

  buildRoutes() {
    this.builRechargedRoute(this.rechargeRouter, this.rechargeController);
  }
}

export interface RechargeRouter extends RechargeRoute {}
applyMixins(RechargeRouter, [RechargeRoute]);
