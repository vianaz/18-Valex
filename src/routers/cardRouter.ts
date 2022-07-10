import { Router } from "express";

import { CardController } from "../controllers/cardController";
import { activeCardMiddleware } from "../middlewares/activeCardMiddleware";
import { apiKeyAndTypeMiddleware } from "../middlewares/apiKeyAndTypeMiddleware";

export class CardRouter {
	public router: Router;
	protected cardController: CardController;

	constructor() {

		this.router = Router();
		this.cardController = new CardController();

		this.routes();
	}

	routes() {
		const router = this.router;
		const {
			activeCard,
			blockCard,
			createCard,
			unblockCard,
			visualizeAmount,
			visualizeCard,
		} = this.cardController;

		router.post("/card", apiKeyAndTypeMiddleware, createCard);
		router.post("/card/:id/active", activeCardMiddleware, activeCard);
		router.get("/card/amount/:id", visualizeAmount);
		router.post("/card/:id/block", blockCard);
		router.post("/card/:id/unblock", unblockCard);
		router.get("/visualizeCard", visualizeCard);
	}
}
