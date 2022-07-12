"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyMiddleware = void 0;
const companyRepository_1 = require("../repositories/companyRepository");
const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    const apiKeyQuery = await (0, companyRepository_1.findByApiKey)(apiKey);
    if (apiKeyQuery === undefined) {
        const typeError = {
            stutsCode: 422,
            message: "not exist this api key",
        };
        return res.status(typeError.stutsCode).send(typeError.message);
    }
    next();
};
exports.apiKeyMiddleware = apiKeyMiddleware;
