import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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
  await prisma.companies.create({ data: companies });
  await prisma.employees.createMany({ data: employees });
  await prisma.businesses.createMany({
    data: [
      { name: "Responde Aí", type: "education" },
      { name: "Extra", type: "groceries" },
      { name: "Driven Eats", type: "restaurant" },
      { name: "Uber", type: "transport" },
      { name: "Unimed", type: "health" },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
