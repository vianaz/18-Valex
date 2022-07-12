"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert = exports.findByCardRechargeId = void 0;
/* eslint-disable quotes */
const database_1 = require("../db/database");
async function findByCardRechargeId(cardId) {
    const result = await database_1.connection.query('SELECT * FROM recharges WHERE "cardId"=$1', [cardId]);
    return result.rows;
}
exports.findByCardRechargeId = findByCardRechargeId;
async function insert(rechargeData) {
    const { cardId, amount } = rechargeData;
    database_1.connection.query('INSERT INTO recharges ("cardId", amount) VALUES ($1, $2)', [cardId, amount]);
}
exports.insert = insert;
