"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAfterDate = exports.sumYears = exports.formatDate = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.extend(customParseFormat_1.default);
const formatDate = (date) => {
    return (0, dayjs_1.default)(date).format("MM/YY");
};
exports.formatDate = formatDate;
const sumYears = (years) => {
    return (0, dayjs_1.default)().add(years, "year").format("MM/YY");
};
exports.sumYears = sumYears;
const isAfterDate = (dateToCompare) => {
    return (0, dayjs_1.default)().isAfter((0, dayjs_1.default)(dateToCompare, "MM/YY"));
};
exports.isAfterDate = isAfterDate;
