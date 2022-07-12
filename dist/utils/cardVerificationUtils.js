"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordCorrect = exports.verifyIfIsBlockedCard = exports.verifyIfIsActiveCard = exports.verifyIfIsSignUpCard = exports.verifyIfIsExpiredCard = void 0;
const cryptographyUtils_1 = require("./cryptographyUtils");
const dayjsUtil_1 = require("./dayjsUtil");
function verifyIfIsExpiredCard(card) {
    const isAfterExpirationDate = (0, dayjsUtil_1.isAfterDate)(card.expirationDate);
    return isAfterExpirationDate;
}
exports.verifyIfIsExpiredCard = verifyIfIsExpiredCard;
function verifyIfIsSignUpCard(card) {
    return card ? true : false;
}
exports.verifyIfIsSignUpCard = verifyIfIsSignUpCard;
function verifyIfIsActiveCard(card) {
    return card.password !== null ? true : false;
}
exports.verifyIfIsActiveCard = verifyIfIsActiveCard;
function verifyIfIsBlockedCard(card) {
    return card.isBlocked;
}
exports.verifyIfIsBlockedCard = verifyIfIsBlockedCard;
function isPasswordCorrect(card, password) {
    const decryptPassword = (0, cryptographyUtils_1.decrypt)(card.password);
    return decryptPassword === password;
}
exports.isPasswordCorrect = isPasswordCorrect;
