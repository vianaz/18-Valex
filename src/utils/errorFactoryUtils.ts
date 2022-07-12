export type ErrorTypes =
  | ""
  | "error_employee_have_type_card"
  | "employee_not_found"
  | "error_active_card"
  | "error_invalid_cvv"
  | "error_invalid_password"
  | "error_expired_card"
  | "error_card_not_found"
  | "error_card_blocked"
  | "error_card_unblocked"
  | "error_business_not_found"
  | "error_business_type_different_from_card"
  | "error_balance_insufficient";

export const errorFactoryUtils = (typeError: ErrorTypes) => {
  switch (typeError) {
    case "error_employee_have_type_card":
      return {
        type: "error_employee_have_type_card",
        message: "Employee already have this type card",
      };

    case "employee_not_found":
      return { type: "employee_not_found", message: "Employee not found" };

    case "error_active_card":
      return { type: "error_active_card", message: "Card already activated" };

    case "error_invalid_cvv":
      return { type: "error_invalid_cvv", message: "Invalid CVV" };

    case "error_invalid_password":
      return { type: "error_invalid_password", message: "Invalid password" };

    case "error_expired_card":
      return { type: "error_expired_card", message: "Card expired" };

    case "error_card_not_found":
      return { type: "error_card_not_found", message: "Card not found" };

    case "error_card_blocked":
      return { type: "error_card_blocked", message: "Card blocked" };

    case "error_card_unblocked":
      return { type: "error_card_unblocked", message: "Card unblocked" };

    case "error_business_not_found":
      return {
        type: "error_business_not_found",
        message: "Business not found",
      };

    case "error_business_type_different_from_card":
      return {
        type: "error_business_type_different_from_card",
        message: "Business type different from card",
      };

    case "error_balance_insufficient":
      return {
        type: "error_balance_insufficient",
        message: "Balance insufficient",
      };

    default:
      break;
  }
};
