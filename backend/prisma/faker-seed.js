const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 5; i++) {
    const fakeUser = createRandomUser();
    await prisma.user.create({
      data: fakeUser,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
