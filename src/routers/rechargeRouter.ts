import { Router } from "express";
import { RechargeController } from "../controllers/rechargeController";

export class RechargeRouter {
	public router: Router;
	protected rechargeController: RechargeController;

	constructor() {
		this.router = Router();
		this.rechargeController = new RechargeController();
    
		this.routes();
	}
	routes() {
		const router = this.router;
		const { addValue } = this.rechargeController;

		router.get("/addValue", addValue);
	}
}
