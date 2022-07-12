"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEmployeeById = void 0;
const database_1 = require("../db/database");
async function findEmployeeById(id) {
    const result = await database_1.connection.query("SELECT * FROM employees WHERE id=$1", [id]);
    return result.rows[0];
}
exports.findEmployeeById = findEmployeeById;
