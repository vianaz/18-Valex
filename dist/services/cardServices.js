"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardServices = void 0;
const faker_1 = require("@faker-js/faker");
const mixins_1 = require("../mixins");
const cardRepository_1 = require("../repositories/cardRepository");
const validateSchemas_1 = require("../schemas/validateSchemas");
const cryptographyUtils_1 = require("../utils/cryptographyUtils");
const dayjsUtil_1 = require("../utils/dayjsUtil");
const errorFactoryUtils_1 = require("../utils/errorFactoryUtils");
class HandlerTypeCard {
    employeeAlreadyHaveTypeCard(type, employeeId) {
        const employeeByTypeAndId = (0, cardRepository_1.findByTypeAndEmployeeId)(type, employeeId);
        return employeeByTypeAndId;
    }
    verifyCorrectTypeCard(type) {
        const isValidType = validateSchemas_1.typesCardSchemas.validate({ type }).error === undefined;
        return isValidType;
    }
}
class HandlerCardData {
    createNumberAndCVV() {
        const number = faker_1.faker.finance.creditCardNumber("####-####-####-####");
        const cvv = faker_1.faker.finance.creditCardCVV();
        // const cryptCVV = encrypt(cvv);
        return { number, cvv };
    }
    cardholderNameFormat(cardholderName) {
        const cardholderNameSplited = cardholderName.split(" ");
        const cardholderNameFormatted = [];
        for (let i = 0; i < cardholderNameSplited.length; i++) {
            const name = cardholderNameSplited[i];
            if (i === 0 || i === cardholderNameSplited.length - 1)
                cardholderNameFormatted.push(name.toUpperCase());
            else if (name.length >= 3)
                cardholderNameFormatted.push(name.charAt(0).toUpperCase());
        }
        return cardholderNameFormatted.join(" ");
    }
    cardExpirationDateFormat() {
        return (0, dayjsUtil_1.sumYears)(5);
    }
}
class HandlerCardActivation {
    async validateCardActivation(id, cvv) {
        const card = await (0, cardRepository_1.findCardById)(id);
        if (!card)
            throw (0, errorFactoryUtils_1.errorFactoryUtils)("error_card_not_found");
        const isAfterExpirationDate = (0, dayjsUtil_1.isAfterDate)(card.expirationDate);
        const isAlreadyActivated = card.password !== null;
        const cvvIsInvalid = (0, cryptographyUtils_1.decrypt)(card.securityCode) !== cvv;
        if (isAfterExpirationDate || isAlreadyActivated || cvvIsInvalid) {
            const message = (isAfterExpirationDate && "error_expired_card") ||
                (isAlreadyActivated && "error_active_card") ||
                (cvvIsInvalid && "error_invalid_cvv");
            throw (0, errorFactoryUtils_1.errorFactoryUtils)(message);
        }
    }
    insertPassword(id, password) {
        const cryptPassword = (0, cryptographyUtils_1.encrypt)(password);
        (0, cardRepository_1.update)(id, { password: cryptPassword });
    }
}
class HandlerCreateUpdateCard extends HandlerCardData {
    buildCardInfos(employeeName) {
        const { number: cardNumber, cvv: cardCVV } = this.createNumberAndCVV();
        const cardholderName = this.cardholderNameFormat(employeeName);
        const expirationDate = this.cardExpirationDateFormat();
        return { cardNumber, cardCVV, cardholderName, expirationDate };
    }
    insertCard({ cardCVV, employeeId, cardholderName, number, type, expirationDate, }) {
        const cvvCrypt = (0, cryptographyUtils_1.encrypt)(cardCVV);
        const cardNumberCrypt = (0, cryptographyUtils_1.encrypt)(number);
        (0, cardRepository_1.insert)({
            employeeId,
            number: cardNumberCrypt,
            type,
            cardholderName,
            securityCode: cvvCrypt,
            expirationDate,
            isBlocked: false,
            isVirtual: false,
            originalCardId: undefined,
        });
    }
}
class CardServices {
    constructor() {
        this.employeeAlreadyHaveTypeCard =
            new HandlerTypeCard().employeeAlreadyHaveTypeCard;
        this.verifyCorrectTypeCard = new HandlerTypeCard().verifyCorrectTypeCard;
        this.validateCardActivation =
            new HandlerCardActivation().validateCardActivation;
        this.buildCardInfos = new HandlerCreateUpdateCard().buildCardInfos;
        this.insertCard = new HandlerCreateUpdateCard().insertCard;
    }
}
exports.CardServices = CardServices;
(0, mixins_1.applyMixins)(CardServices, [
    HandlerCardData,
    HandlerTypeCard,
    HandlerCardActivation,
    HandlerCreateUpdateCard,
]);
