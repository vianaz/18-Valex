import { applyMixins } from "../mixins";
import { Business } from "../repositories/businessRepository";
import { Card } from "../repositories/cardRepository";
import { findByCardId } from "../repositories/paymentRepository";
import { findByCardRechargeId } from "../repositories/rechargeRepository";

class BussinessCheck {
  isBussiness(business: Business): boolean {
    return business ? true : false;
  }
  isBussinesTypeEqualCardType(business: Business, card: Card): boolean {
    return business.type === card.type;
  }
}
class CheckBalance {
  async calculeBalance(card: Card): Promise<number> {
    const { id } = card;
    const recharges = await findByCardRechargeId(id);
    const payment = await findByCardId(id);

    const sumRecharges = recharges.reduce((acc, cur) => acc + cur.amount, 0);
    const sumPayments = payment.reduce((acc, cur) => acc + cur.amount, 0);
    const balance = sumRecharges - sumPayments;

    return balance;
  }
}

export class PaymentServices {
  public isBussiness: any;
  public isBussinesTypeEqualCardType: any;
  public calculeBalance: any;

  constructor() {
    this.isBussinesTypeEqualCardType =
      new BussinessCheck().isBussinesTypeEqualCardType;
    this.isBussiness = new BussinessCheck().isBussiness;
    this.calculeBalance = new CheckBalance().calculeBalance;
  }
}

export interface PaymentServices extends BussinessCheck, CheckBalance {}
applyMixins(PaymentServices, [BussinessCheck, CheckBalance]);
