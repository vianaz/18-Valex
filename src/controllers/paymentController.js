"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const businessRepository_1 = require("../repositories/businessRepository");
const cardRepository_1 = require("../repositories/cardRepository");
const paymentRepository_1 = require("../repositories/paymentRepository");
const cardServices_1 = require("../services/cardServices");
const paymentServices_1 = require("../services/paymentServices");
const cardVerificationUtils_1 = require("../utils/cardVerificationUtils");
const errorFactoryUtils_1 = require("../utils/errorFactoryUtils");
class Buy {
    constructor() {
        this.buySomething = async (req, res) => {
            const { paymentService } = this;
            const { id: cardId } = req.params;
            const { amount, password, businessId } = req.body;
            const card = await (0, cardRepository_1.findCardById)(cardId);
            const business = await (0, businessRepository_1.findById)(businessId);
            const verifyValidation = (!(0, cardVerificationUtils_1.verifyIfIsSignUpCard)(card) && "error_card_not_found") ||
                (!(0, cardVerificationUtils_1.verifyIfIsActiveCard)(card) && "error_active_card") ||
                ((0, cardVerificationUtils_1.verifyIfIsExpiredCard)(card) && "error_expired_card") ||
                ((0, cardVerificationUtils_1.verifyIfIsBlockedCard)(card) && "error_card_blocked") ||
                (!(0, cardVerificationUtils_1.isPasswordCorrect)(card, password) && "error_invalid_password") ||
                (!paymentService.isBussiness(businessId) && "error_business_not_found") ||
                (!paymentService.isBussinesTypeEqualCardType(business, card) &&
                    "error_business_type_different_from_card") ||
                (!((await paymentService.calculeBalance(card)) >= amount) &&
                    "error_balance_insufficient");
            if (verifyValidation) {
                throw (0, errorFactoryUtils_1.errorFactoryUtils)(verifyValidation);
            }
            (0, paymentRepository_1.insert)({ cardId, amount, businessId });
            res.send("ok");
        };
        this.paymentService = new paymentServices_1.PaymentServices();
        this.cardService = new cardServices_1.CardServices();
    }
}
class PaymentController {
    constructor() {
        this.buy = new Buy().buySomething;
    }
}
exports.PaymentController = PaymentController;
