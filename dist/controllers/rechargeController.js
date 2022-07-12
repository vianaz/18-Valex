"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RechargeController = void 0;
const cardRepository_1 = require("../repositories/cardRepository");
const rechargeRepository_1 = require("../repositories/rechargeRepository");
const cardServices_1 = require("../services/cardServices");
const cardVerificationUtils_1 = require("../utils/cardVerificationUtils");
const errorFactoryUtils_1 = require("../utils/errorFactoryUtils");
class RechargeValue {
    constructor() {
        this.rechargeValue = async (req, res) => {
            const { id } = req.params;
            const { value } = req.body;
            const card = await (0, cardRepository_1.findCardById)(id);
            if (!card) {
                throw (0, errorFactoryUtils_1.errorFactoryUtils)("error_card_not_found");
            }
            const isExpiredCard = (0, cardVerificationUtils_1.verifyIfIsExpiredCard)(card);
            const isBlocked = (0, cardVerificationUtils_1.verifyIfIsBlockedCard)(card);
            if (isExpiredCard || isBlocked) {
                const errorMessage = isExpiredCard
                    ? "error_expired_card"
                    : "error_card_blocked";
                throw (0, errorFactoryUtils_1.errorFactoryUtils)(errorMessage);
            }
            (0, rechargeRepository_1.insert)({ cardId: id, amount: value });
            res.send("recharge done with success");
        };
        this.cardService = new cardServices_1.CardServices();
    }
}
class RechargeController {
    constructor() {
        this.rechargeValue = new RechargeValue().rechargeValue;
    }
}
exports.RechargeController = RechargeController;
