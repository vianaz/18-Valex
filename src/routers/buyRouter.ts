import { Router } from "express";
import { BuyController } from "../controllers/buyController";

export class BuyRouter {
	public router: Router;
	protected buyController: BuyController;

	constructor() {
		this.router = Router();
		this.buyController = new BuyController();
    
		this.routes();
	}

	routes() {
		const router = this.router;
		const { buySomething } = this.buyController;

		router.get("/buy", buySomething);
	}
}
