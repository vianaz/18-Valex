import { Card } from "../repositories/cardRepository";
import { decrypt } from "./cryptographyUtils";
import { isAfterDate } from "./dayjsUtil";

export function verifyIfIsExpiredCard(card: Card): boolean {
  const isAfterExpirationDate = isAfterDate(card.expirationDate);
  return isAfterExpirationDate;
}
export function verifyIfIsSignUpCard(card: Card): boolean {
  return card ? true : false;
}
export function verifyIfIsActiveCard(card: Card): boolean {
  return card.password !== null ? true : false;
}
export function verifyIfIsBlockedCard(card: Card): boolean {
  return card.isBlocked;
}
export function isPasswordCorrect(card: Card, password: string): boolean {
  const decryptPassword = decrypt(card.password);
  return decryptPassword === password;
}
