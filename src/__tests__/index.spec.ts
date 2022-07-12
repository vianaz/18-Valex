import { PaymentServices } from "../services/paymentServices";

describe("testar soma", () => {
  it("devolva 4", () => {
    const password = "123";
    const teste = new PaymentServices().verifyIfIsActiveCard({ password });

    expect(teste).toBe(true);
  });
  it("outro teste", () => {
    const soma = 2 + 2;
    expect(soma).toBe(3);
  });
});

