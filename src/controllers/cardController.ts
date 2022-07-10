import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository";
import { Employee } from "../repositories/employeeRepository";
import {
	ActivateCardService,
	CardServices,
	CreateCardService,
} from "../services/cardServices";

interface CreateCardBody {
  cardType: TransactionTypes;
  employeeId: number;
}
interface ActiveCardBody {
  cvv: string;
  password: string;
}

// tentar enteder porque o constructor não tá funcionando
export class CardController {
	async createCard(req: Request, res: Response) {
		const cardServices = new CardServices();
		const createCardService = new CreateCardService();

		const apiKey = req.headers["x-api-key"] as string;
		const { cardType, employeeId }: CreateCardBody = req.body;

		const employee = await cardServices.findEmployee(employeeId);
		const employeeHaveTypeCard = await cardServices.verifyEmployeeHaveTypeCard(
			cardType,
			employeeId,
		);

		// refatorar esses if's depois
		if (employee === undefined || employeeHaveTypeCard) {
			// refatorar para novo formato de erro
			const typeError =
        (employee === undefined && {
        	stutsCode: 404,
        	message: "not exist this employee",
        }) ||
        (employeeHaveTypeCard && {
        	stutsCode: 409,
        	message: "employee have this type",
        });

			return res.status(typeError.stutsCode).send(typeError.message);
		}

		createCardService.buildCardInfo(employeeId, cardType, employee.fullName);
		res.status(201).send("card created with success");
	}

	async activeCard(
		req: Request<{ id: number }, any, ActiveCardBody>,
		res: Response,
	) {
		const cardServices = new CardServices();
		const cardActiveService = new ActivateCardService();

		const { id: cardId } = req.params;
		const { cvv, password } = req.body;
		const isValidateToActive = await cardServices.validateCardActivation(
			cardId,
			cvv,
		);

		if (!isValidateToActive) {
			return res.status(409).send("card is already activated");
		}

		cardActiveService.activateCard(cardId, password);
		res.status(200).send("card activated with success");
	}
	visualizeCard(req: Request, res: Response) {
		res.send("visualizeCard");
	}
	visualizeAmount(req: Request, res: Response) {
		res.send("visualizeAmount");
	}
	blockCard(req: Request, res: Response) {
		res.send("blockCard");
	}
	deleteCard(req: Request, res: Response) {
		res.send("deleteCard");
	}
}
function id(id: any, password: string) {
	throw new Error("Function not implemented.");
}
