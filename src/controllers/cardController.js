"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const mixins_1 = require("../mixins");
const cardRepository_1 = require("../repositories/cardRepository");
const employeeRepository_1 = require("../repositories/employeeRepository");
const paymentRepository = __importStar(require("../repositories/paymentRepository"));
const rechargeRepository = __importStar(require("../repositories/rechargeRepository"));
const cardServices_1 = require("../services/cardServices");
const paymentServices_1 = require("../services/paymentServices");
const cardVerificationUtils_1 = require("../utils/cardVerificationUtils");
const errorFactoryUtils_1 = require("../utils/errorFactoryUtils");
class CreateCard {
    constructor() {
        this.createCard = async (req, res) => {
            const { cardService } = this;
            const { cardType, employeeId } = req.body;
            const employee = await (0, employeeRepository_1.findEmployeeById)(employeeId);
            const employeeHaveTypeCard = await cardService.employeeAlreadyHaveTypeCard(cardType, employeeId);
            if (employee === undefined || employeeHaveTypeCard) {
                // refatorar para novo formato de erro
                const typeError = employeeHaveTypeCard
                    ? "error_employee_have_type_card"
                    : "employee_not_found";
                throw (0, errorFactoryUtils_1.errorFactoryUtils)(typeError);
            }
            const { cardNumber, cardCVV, cardholderName, expirationDate } = cardService.buildCardInfos(employee.fullName);
            cardService.insertCard({
                cardCVV,
                employeeId,
                cardholderName,
                number: cardNumber,
                type: cardType,
                expirationDate,
            });
            res.status(201).send({
                cardholderName,
                number: cardNumber,
                cvv: cardCVV,
                expirationDate,
                type: cardType,
            });
        };
        this.cardService = new cardServices_1.CardServices();
    }
}
class ActiveCard {
    constructor() {
        this.activeCard = async (req, res) => {
            const { activeService } = this;
            const { id: cardId } = req.params;
            const { cvv, password } = req.body;
            await activeService.validateCardActivation(cardId, cvv);
            activeService.insertPassword(cardId, password);
            res.status(201).send("card activated with success");
        };
        this.activeService = new cardServices_1.CardServices();
    }
}
class VisualizeAmount {
    constructor() {
        this.visualizeAmount = async (req, res) => {
            const { visualizeService } = this;
            const { id } = req.params;
            const card = await (0, cardRepository_1.findCardById)(id);
            const transactions = await paymentRepository.findByCardId(id);
            const recharges = await rechargeRepository.findByCardRechargeId(id);
            if (!card) {
                throw (0, errorFactoryUtils_1.errorFactoryUtils)("error_card_not_found");
            }
            const balance = await visualizeService.calculeBalance(card);
            res.send({ balance, transactions, recharges });
        };
        this.visualizeService = new paymentServices_1.PaymentServices();
    }
}
class BlockCard {
    constructor() {
        this.blockCard = async (req, res) => {
            const { id } = req.params;
            const { password } = req.body;
            const card = await (0, cardRepository_1.findCardById)(id);
            if (!card)
                throw (0, errorFactoryUtils_1.errorFactoryUtils)("error_card_not_found");
            const isBlocked = (0, cardVerificationUtils_1.verifyIfIsBlockedCard)(card);
            const isExpiredCard = (0, cardVerificationUtils_1.verifyIfIsExpiredCard)(card);
            const isCorrectPassword = (0, cardVerificationUtils_1.isPasswordCorrect)(card, password);
            if (isBlocked || isExpiredCard || !isCorrectPassword) {
                const errorMessage = (isBlocked && "error_card_blocked") ||
                    (isExpiredCard && "error_expired_card") ||
                    (!isCorrectPassword && "error_invalid_password");
                throw (0, errorFactoryUtils_1.errorFactoryUtils)(errorMessage);
            }
            (0, cardRepository_1.update)(id, { isBlocked: true });
            res.send("card blocked with success");
        };
    }
}
class UnblockCard {
    constructor() {
        this.unblockCard = async (req, res) => {
            const { id } = req.params;
            const { password } = req.body;
            const card = await (0, cardRepository_1.findCardById)(id);
            if (!card)
                throw (0, errorFactoryUtils_1.errorFactoryUtils)("error_card_not_found");
            const isBlocked = (0, cardVerificationUtils_1.verifyIfIsBlockedCard)(card);
            const isExpiredCard = (0, cardVerificationUtils_1.verifyIfIsExpiredCard)(card);
            const isCorrectPassword = (0, cardVerificationUtils_1.isPasswordCorrect)(card, password);
            if (!isBlocked || isExpiredCard || !isCorrectPassword) {
                const errorMessage = (!isBlocked && "error_card_unblocked") ||
                    (isExpiredCard && "error_expired_card") ||
                    (!isCorrectPassword && "error_invalid_password");
                throw (0, errorFactoryUtils_1.errorFactoryUtils)(errorMessage);
            }
            (0, cardRepository_1.update)(id, { isBlocked: false });
            res.send("card unblocked with success");
        };
    }
}
class CardController {
    constructor() {
        this.createCard = new CreateCard().createCard;
        this.activeCard = new ActiveCard().activeCard;
        this.visualizeAmount = new VisualizeAmount().visualizeAmount;
        this.blockCard = new BlockCard().blockCard;
        this.unblockCard = new UnblockCard().unblockCard;
    }
}
exports.CardController = CardController;
(0, mixins_1.applyMixins)(CardController, [
    CreateCard,
    ActiveCard,
    VisualizeAmount,
    BlockCard,
    UnblockCard,
]);
