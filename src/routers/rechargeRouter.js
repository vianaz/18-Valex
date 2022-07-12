"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RechargeRouter = void 0;
const express_1 = require("express");
const rechargeController_1 = require("../controllers/rechargeController");
const apiKeyMiddleware_1 = require("../middlewares/apiKeyMiddleware");
const mixins_1 = require("../mixins");
class RechargeRoute {
    builRechargedRoute(router, controller) {
        const { rechargeValue } = controller;
        router.post("/recharge/:id", apiKeyMiddleware_1.apiKeyMiddleware, rechargeValue);
    }
}
class RechargeRouter {
    constructor() {
        this.rechargeRouter = (0, express_1.Router)();
        this.rechargeController = new rechargeController_1.RechargeController();
        this.buildRoutes();
    }
    buildRoutes() {
        this.builRechargedRoute(this.rechargeRouter, this.rechargeController);
    }
}
exports.RechargeRouter = RechargeRouter;
(0, mixins_1.applyMixins)(RechargeRouter, [RechargeRoute]);
