import { applyMixins } from "../mixins";
import { Business } from "../repositories/businessRepository";
import { Card } from "../repositories/cardRepository";
import { findByCardId } from "../repositories/paymentRepository";
import { findByCardRechargeId } from "../repositories/rechargeRepository";
import { isAfterDate } from "../utils/dayjsUtil";

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

    return balance >= amount;
  }
}

export class PaymentServices {
  public isBussiness: any;
  public isBussinesTypeEqualCardType: any;
  public isBalanceEnough: any;

  constructor() {
    this.isBussinesTypeEqualCardType =
      new BussinessCheck().isBussinesTypeEqualCardType;
    this.isBussiness = new BussinessCheck().isBussiness;
    this.isBalanceEnough = new CheckBalance().isBalanceEnough;
  }
}

export interface PaymentServices extends BussinessCheck, CheckBalance {}
applyMixins(PaymentServices, [BussinessCheck, CheckBalance]);
