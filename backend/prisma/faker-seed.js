const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

function createRandomUser() {
  return {
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    saltedHash: faker.internet.password(),
  };
}

async function main() {
  const users = faker.helpers.multiple(createRandomUser, { count: 5 });

  await prisma.user.createMany({
    data: users,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
