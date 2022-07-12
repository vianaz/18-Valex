"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvvCardSchemas = void 0;
const joi_1 = __importDefault(require("joi"));
exports.cvvCardSchemas = joi_1.default.object({
    cvv: joi_1.default.string()
        .pattern(/^[0-9]{4}$/)
        .required(),
    password: joi_1.default.string()
        .pattern(/^[0-9]{3}$/)
        .required(),
});
