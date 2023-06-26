const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.client.create({
    data: {
      name: "Marco Tulio",
      email: "marcotuliovaleriano2014@gmail.com",
      phone: "31999999999",
      address: {
        create: {
          street: "Rodrigues caldas",
          number: "112",
          district: "Bom pastor",
          city: "Divinopolis",
          state: "MG",
        },
      },
    },
    include: {
      address: true, // Include the created profile in the response
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
