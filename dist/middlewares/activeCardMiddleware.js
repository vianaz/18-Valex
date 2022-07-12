"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeCardMiddleware = void 0;
const validateSchemas_1 = require("../schemas/validateSchemas");
const activeCardMiddleware = async (req, res, next) => {
    const { error } = validateSchemas_1.cvvCardSchemas.validate(req.body);
    if (error) {
        return res.status(422).send({ error });
    }
    next();
};
exports.activeCardMiddleware = activeCardMiddleware;
