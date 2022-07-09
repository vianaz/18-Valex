import { faker } from "@faker-js/faker";
import {
  findByTypeAndEmployeeId,
  TransactionTypes,
} from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { typesCardSchemas } from "../schemas/typesCardSchemas";
import { encrypt } from "../utils/cryptographyUtils";
import { sumYears } from "../utils/dayjsUtil";

export class CardServices {
  private YEAR_VALID = 5;

  apiKeyVerification(apiKey: string): boolean {
    const apiKeyQuery = findByApiKey(apiKey);
    const haveOne = apiKeyQuery !== undefined;
    return haveOne;
  }

  verifyTypeCard(type: string): boolean {
    const isValidType = typesCardSchemas.validate({ type }).error !== null;
    return isValidType;
  }

  verifyEmployeeHaveTypeCard(
    type: TransactionTypes,
    employeeId: number,
  ): boolean {
    const employeeAreadyHaveTypeCard =
      findByTypeAndEmployeeId(type, employeeId) !== undefined;
    return employeeAreadyHaveTypeCard;
  }

  cardHolderNameFormat(cardHolderName: string): string {
    const cardHolderNameSplited = cardHolderName.split(" ");
    const cardHolderNameFormatted = [];

    for (let i = 0; i < cardHolderNameSplited.length; i++) {
      const name = cardHolderNameSplited[i];

      if (i === 0 || i === cardHolderNameSplited.length - 1)
        cardHolderNameFormatted.push(name.toUpperCase());
      if (name.length >= 3)
        cardHolderNameFormatted.push(name.charAt(0).toUpperCase());
    }

    return cardHolderNameFormatted.join(" ");
  }

  cardValidFormat(): string {
    return sumYears(new Date(), this.YEAR_VALID);
  }

  createCardInfo(): { number: string; cvv: string } {
    const number = faker.finance.creditCardNumber("####-####-####-####");
    const cvv = faker.finance.creditCardCVV();
    const cryptCVV = encrypt(cvv);

    return { number, cvv: cryptCVV };
  }
}
