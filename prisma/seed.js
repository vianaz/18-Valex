"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const companies = {
            name: "Driven",
            apiKey: "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0",
        };
        const employees = [
            {
                fullName: "Fulano Rubens da Silva",
                cpf: "47100935741",
                email: "fulano.silva@gmail.com",
                companyId: 1,
            },
            {
                fullName: "Ciclana Maria Madeira",
                cpf: "08434681895",
                email: "cilhaninha@gmail.com",
                companyId: 1,
            },
        ];
        yield prisma.companies.create({ data: companies });
        yield prisma.employees.createMany({ data: employees });
        yield prisma.businesses.createMany({
            data: [
                { name: "Responde Aí", type: "education" },
                { name: "Extra", type: "groceries" },
                { name: "Driven Eats", type: "restaurant" },
                { name: "Uber", type: "transport" },
                { name: "Unimed", type: "health" },
            ],
        });
    });
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=seed.js.map