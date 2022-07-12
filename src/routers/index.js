"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routers = void 0;
const express_1 = require("express");
const cardRouter_1 = require("./cardRouter");
const paymentRouter_1 = require("./paymentRouter");
const rechargeRouter_1 = require("./rechargeRouter");
class Routers {
    constructor() {
        this.router = (0, express_1.Router)();
        this.cardRouter = new cardRouter_1.CardRouter().cardRouter;
        this.rechargeRouter = new rechargeRouter_1.RechargeRouter().rechargeRouter;
        this.paymentRouter = new paymentRouter_1.PaymentRouter().paymentRouter;
        this.buildRoutes();
    }
    buildRoutes() {
        const { router, cardRouter, rechargeRouter, paymentRouter } = this;
        router.use(cardRouter);
        router.use(rechargeRouter);
        router.use(paymentRouter);
    }
}
exports.Routers = Routers;
