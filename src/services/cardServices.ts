import { faker } from "@faker-js/faker";
import { log } from "console";
import {
  CardInsertData,
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
} from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { typesCardSchemas } from "../schemas/typesCardSchemas";
import { encrypt } from "../utils/cryptographyUtils";
import { sumYears } from "../utils/dayjsUtil";

export class CardServices {
  private YEAR_VALID = 5;

  async apiKeyVerification(apiKey: string) {
    const apiKeyQuery = await findByApiKey(apiKey);
    return apiKeyQuery;
  }

  findEmployee(employeeId: number) {
    const employee = findById(employeeId);
    return employee;
  }

  verifyTypeCard(type: TransactionTypes): boolean {
    const isValidType = typesCardSchemas.validate({ type }).error === undefined;

    return isValidType;
  }

  verifyEmployeeHaveTypeCard(type: TransactionTypes, employeeId: number) {
    console.log("oi");

    const employeeByTypeAndId = findByTypeAndEmployeeId(type, employeeId);
    return employeeByTypeAndId;
  }

  cardholderNameFormat(cardholderName: string): string {
    const cardholderNameSplited = cardholderName.split(" ");
    const cardholderNameFormatted = [];

    for (let i = 0; i < cardholderNameSplited.length; i++) {
      const name = cardholderNameSplited[i];

      if (i === 0 || i === cardholderNameSplited.length - 1)
        cardholderNameFormatted.push(name.toUpperCase());
      else if (name.length >= 3)
        cardholderNameFormatted.push(name.charAt(0).toUpperCase());
    }

    return cardholderNameFormatted.join(" ");
  }

  cardExpirationDateFormat(): string {
    return sumYears(new Date(), this.YEAR_VALID);
  }

  createNumberAndCVV(): { number: string; cvv: string } {
    const number = faker.finance.creditCardNumber("####-####-####-####");
    const cvv = faker.finance.creditCardCVV();
    const cryptCVV = encrypt(cvv);

    return { number, cvv: cryptCVV };
  }
}

export class CreateCardService extends CardServices {
  constructor() {
    super();
  }

  buildCardInfo(
    employeeId: number,
    type: TransactionTypes,
    nameEmployee: string,
  ) {
    const { number, cvv } = this.createNumberAndCVV();
    const cardholderName = this.cardholderNameFormat(nameEmployee);
    const expirationDate = this.cardExpirationDateFormat();

    insert({
      employeeId,
      number,
      type,
      cardholderName,
      securityCode: cvv,
      expirationDate,
      isBlocked: false,
      isVirtual: false,
      originalCardId: undefined,
    });
  }
}
