"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const mixins_1 = require("../mixins");
class BuyRoute {
    buildBuyRoute(router, controller) {
        const { buy } = controller;
        router.post("/buy/:id", buy);
    }
}
class PaymentRouter {
    constructor() {
        this.paymentRouter = (0, express_1.Router)();
        this.buyController = new paymentController_1.PaymentController();
        this.buildRouter();
    }
    buildRouter() {
        this.buildBuyRoute(this.paymentRouter, this.buyController);
    }
}
exports.PaymentRouter = PaymentRouter;
(0, mixins_1.applyMixins)(PaymentRouter, [BuyRoute]);
