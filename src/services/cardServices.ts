import { faker } from "@faker-js/faker";
import { applyMixins } from "../mixins";
import {
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
  findCardById,
  update,
} from "../repositories/cardRepository";
import { typesCardSchemas } from "../schemas/validateSchemas";
import { decrypt, encrypt } from "../utils/cryptographyUtils";
import { isAfterDate, sumYears } from "../utils/dayjsUtil";
import { errorFactoryUtils } from "../utils/errorFactoryUtils";

interface IActiveReturn {
  status: boolean;
  message: string;
}

class HandlerTypeCard {
  employeeAlreadyHaveTypeCard(type: TransactionTypes, employeeId: number) {
    const employeeByTypeAndId = findByTypeAndEmployeeId(type, employeeId);
    return employeeByTypeAndId;
  }
  verifyCorrectTypeCard(type: TransactionTypes): boolean {
    const isValidType = typesCardSchemas.validate({ type }).error === undefined;
    return isValidType;
  }
}

class HandlerCardData {
  createNumberAndCVV(): { number: string; cvv: string } {
    const number = faker.finance.creditCardNumber("####-####-####-####");
    const cvv = faker.finance.creditCardCVV();
    // const cryptCVV = encrypt(cvv);
    return { number, cvv };
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
    return sumYears(5);
  }
}
class HandlerCardActivation {
  async validateCardActivation(id: number, cvv: string) {
    const card = await findCardById(id);

    if (!card) throw errorFactoryUtils("error_card_not_found");

    const isAfterExpirationDate = isAfterDate(card.expirationDate);
    const isAlreadyActivated = card.password !== null;
    const cvvIsInvalid = decrypt(card.securityCode) !== cvv;

    if (isAfterExpirationDate || isAlreadyActivated || cvvIsInvalid) {
      const message =
        (isAfterExpirationDate && "error_expired_card") ||
        (isAlreadyActivated && "error_active_card") ||
        (cvvIsInvalid && "error_invalid_cvv");
      throw errorFactoryUtils(message);
    }
  }
  insertPassword(id: number, password: string) {
    const cryptPassword = encrypt(password);

    update(id, { password: cryptPassword });
  }
}

class HandlerCreateUpdateCard extends HandlerCardData {
  buildCardInfos(employeeName: string) {
    const { number: cardNumber, cvv: cardCVV } = this.createNumberAndCVV();
    const cardholderName = this.cardholderNameFormat(employeeName);
    const expirationDate = this.cardExpirationDateFormat();

    return { cardNumber, cardCVV, cardholderName, expirationDate };
  }
  insertCard({
    cardCVV,
    employeeId,
    cardholderName,
    number,
    type,
    expirationDate,
  }) {
    const cvvCrypt = encrypt(cardCVV);
    const cardNumberCrypt = encrypt(number);
    insert({
      employeeId,
      number: cardNumberCrypt,
      type,
      cardholderName,
      securityCode: cvvCrypt,
      expirationDate,
      isBlocked: false,
      isVirtual: false,
      originalCardId: undefined,
    });
  }
}

export class CardServices {
  public employeeAlreadyHaveTypeCard: any;
  public verifyCorrectTypeCard: any;
  public validateCardActivation: any;
  public buildCardInfos: any;
  public insertCard: any;

  constructor() {
    this.employeeAlreadyHaveTypeCard =
      new HandlerTypeCard().employeeAlreadyHaveTypeCard;
    this.verifyCorrectTypeCard = new HandlerTypeCard().verifyCorrectTypeCard;
    this.validateCardActivation =
      new HandlerCardActivation().validateCardActivation;
    this.buildCardInfos = new HandlerCreateUpdateCard().buildCardInfos;
    this.insertCard = new HandlerCreateUpdateCard().insertCard;
  }
}

export interface CardServices
  extends HandlerCardActivation,
    HandlerCardData,
    HandlerTypeCard,
    HandlerCreateUpdateCard {}

applyMixins(CardServices, [
  HandlerCardData,
  HandlerTypeCard,
  HandlerCardActivation,
  HandlerCreateUpdateCard,
]);
