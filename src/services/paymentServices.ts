import { applyMixins } from "../mixins";
import { Business } from "../repositories/businessRepository";
import { Card } from "../repositories/cardRepository";
import { findByCardId } from "../repositories/paymentRepository";
import { findByCardRechargeId } from "../repositories/rechargeRepository";
import { isAfterDate } from "../utils/dayjsUtil";

class CheckSignUpCard {
  verifyIfIsSignUpCard(card: Card): boolean {
    return card ? true : false;
  }
}
class CheckActivedCard {
  verifyIfIsActiveCard(card: Card): boolean {

    return card.password !== null;
  }
}
class CheckExpiredCard {
  verifyIfIsExpiredCard(card: Card): boolean {
    const isAfterExpirationDate = isAfterDate(card.expirationDate);
    return isAfterExpirationDate;
  }
}
class CheckBlockedCard {
  verifyIfIsBlockedCard(card: Card): boolean {
    return card.isBlocked;
  }
}
class CheckPasswordCard {
  isPasswordCorrect(card: Card, password: string): boolean {
    return card.password === password;
  }
}
class BussinessCheck {
  isBussiness(business: Business): boolean {
    return business ? true : false;
  }
  isBussinesTypeEqualCardType(business: Business, card: Card): boolean {
    return business.type === card.type;
  }
}
class CheckBalance {
  async isBalanceEnough(card: Card, amount: number): Promise<boolean> {
    const { id } = card;
    const recharges = await findByCardRechargeId(id);
    const payment = await findByCardId(id);

    const sumRecharges = recharges.reduce((acc, cur) => acc + cur.amount, 0);
    const sumPayments = payment.reduce((acc, cur) => acc + cur.amount, 0);
    const balance = sumRecharges - sumPayments;
    console.log(balance >= amount);

    return balance >= amount;
  }
}

export class PaymentServices {
  public verifyIfIsSignUpCard: any;
  public verifyIfIsActiveCard: any;
  public verifyIfIsExpiredCard: any;
  public verifyIfIsBlockedCard: any;
  public checkPasswordCard: any;
  public isBussiness: any;
  public isBussinesTypeEqualCardType: any;
  public isBalanceEnough: any;

  constructor() {
    this.verifyIfIsSignUpCard = new CheckSignUpCard().verifyIfIsSignUpCard;
    this.verifyIfIsActiveCard = new CheckActivedCard().verifyIfIsActiveCard;
    this.verifyIfIsExpiredCard = new CheckExpiredCard().verifyIfIsExpiredCard;
    this.verifyIfIsBlockedCard = new CheckBlockedCard().verifyIfIsBlockedCard;
    this.checkPasswordCard = new CheckPasswordCard().isPasswordCorrect;
    this.isBussinesTypeEqualCardType =
      new BussinessCheck().isBussinesTypeEqualCardType;
    this.isBussiness = new BussinessCheck().isBussiness;
    this.isBalanceEnough = new CheckBalance().isBalanceEnough;
  }
}

export interface PaymentServices
  extends CheckSignUpCard,
    CheckActivedCard,
    CheckExpiredCard,
    CheckBlockedCard,
    BussinessCheck,
    CheckPasswordCard {}
applyMixins(PaymentServices, [
  CheckSignUpCard,
  CheckActivedCard,
  CheckExpiredCard,
  CheckBlockedCard,
  BussinessCheck,
  CheckPasswordCard,
]);
