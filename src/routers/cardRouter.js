"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRouter = void 0;
const express_1 = require("express");
const cardController_1 = require("../controllers/cardController");
const activeCardMiddleware_1 = require("../middlewares/activeCardMiddleware");
const apiKeyMiddleware_1 = require("../middlewares/apiKeyMiddleware");
const mixins_1 = require("../mixins");
class CreateCardRoute {
    buildCreateRoute(router, controller) {
        const { createCard } = controller;
        router.post("/card", apiKeyMiddleware_1.apiKeyMiddleware, createCard);
    }
}
class ActiveCardRoute {
    buildActiveRoute(router, controller) {
        const { activeCard } = controller;
        router.post("/card/:id/active", activeCardMiddleware_1.activeCardMiddleware, activeCard);
    }
}
class VisualizeAmoutRoute {
    buildVisualizeRoute(router, controller) {
        const { visualizeAmount } = controller;
        router.get("/card/amount/:id", visualizeAmount);
    }
}
class BlockCardRoute {
    buildBlockRoute(router, controller) {
        const { blockCard } = controller;
        router.post("/card/:id/block", blockCard);
    }
}
class UnblockCardRoute {
    buildUnblockRoute(router, controller) {
        const { unblockCard } = controller;
        router.post("/card/:id/unblock", unblockCard);
    }
}
class CardRouter {
    constructor() {
        this.cardRouter = (0, express_1.Router)();
        this.cardController = new cardController_1.CardController();
        this.buildRouter();
    }
    buildRouter() {
        this.buildCreateRoute(this.cardRouter, this.cardController);
        this.buildActiveRoute(this.cardRouter, this.cardController);
        this.buildVisualizeRoute(this.cardRouter, this.cardController);
        this.buildBlockRoute(this.cardRouter, this.cardController);
        this.buildUnblockRoute(this.cardRouter, this.cardController);
    }
}
exports.CardRouter = CardRouter;
(0, mixins_1.applyMixins)(CardRouter, [
    CreateCardRoute,
    ActiveCardRoute,
    VisualizeAmoutRoute,
    BlockCardRoute,
    UnblockCardRoute,
]);
