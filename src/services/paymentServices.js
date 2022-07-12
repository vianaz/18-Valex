"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const mixins_1 = require("../mixins");
const paymentRepository_1 = require("../repositories/paymentRepository");
const rechargeRepository_1 = require("../repositories/rechargeRepository");
class BussinessCheck {
    isBussiness(business) {
        return business ? true : false;
    }
    isBussinesTypeEqualCardType(business, card) {
        return business.type === card.type;
    }
}
class CheckBalance {
    async calculeBalance(card) {
        const { id } = card;
        const recharges = await (0, rechargeRepository_1.findByCardRechargeId)(id);
        const payment = await (0, paymentRepository_1.findByCardId)(id);
        const sumRecharges = recharges.reduce((acc, cur) => acc + cur.amount, 0);
        const sumPayments = payment.reduce((acc, cur) => acc + cur.amount, 0);
        const balance = sumRecharges - sumPayments;
        return balance;
    }
}
class PaymentServices {
    constructor() {
        this.isBussinesTypeEqualCardType =
            new BussinessCheck().isBussinesTypeEqualCardType;
        this.isBussiness = new BussinessCheck().isBussiness;
        this.calculeBalance = new CheckBalance().calculeBalance;
    }
}
exports.PaymentServices = PaymentServices;
(0, mixins_1.applyMixins)(PaymentServices, [BussinessCheck, CheckBalance]);
