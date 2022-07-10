import { faker } from "@faker-js/faker";
import {
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
  findCardById,
  Card,
  update,
} from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findEmployeeById } from "../repositories/employeeRepository";
import { typesCardSchemas } from "../schemas/validateSchemas";
import { encrypt } from "../utils/cryptographyUtils";
import { isAfterDate, sumYears } from "../utils/dayjsUtil";

export class CardServices {
  private YEAR_VALID = 5;

  async apiKeyVerification(apiKey: string) {
    const apiKeyQuery = await findByApiKey(apiKey);
    return apiKeyQuery;
  }

  findEmployee(employeeId: number) {
    const employee = findEmployeeById(employeeId);
    return employee;
  }
  findCard(id: number) {
    const card = findCardById(id);
    return card;
  }

  verifyTypeCard(type: TransactionTypes): boolean {
    const isValidType = typesCardSchemas.validate({ type }).error === undefined;

    return isValidType;
  }

  verifyEmployeeHaveTypeCard(type: TransactionTypes, employeeId: number) {
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
    // const cryptCVV = encrypt(cvv);

    return { number, cvv };
  }
  isBlockedCard(card: Card): boolean {
    const isBlocked = card.isBlocked;

    return isBlocked;
  }
  alreadyExpiredCard(card: Card): boolean {
    const isAfterExpirationDate = isAfterDate(card.expirationDate);

    return isAfterExpirationDate;
  }

  async validateCardActivation(
    id: number,
    cvv: string,
  ): Promise<Card | boolean> {
    const card = await findCardById(id);

    if (!card) return false;

    const isAfterExpirationDate = isAfterDate(card.expirationDate);
    const isAreadyActivated = card.password !== null;
    const cvvIsInvalid = card.securityCode !== cvv;

    if (isAfterExpirationDate || isAreadyActivated || cvvIsInvalid)
      return false;

    return true;
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
