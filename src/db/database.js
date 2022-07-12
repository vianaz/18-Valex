"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
exports.connection = new Pool({
    connectionString: process.env.DATABASE_URL,
});
