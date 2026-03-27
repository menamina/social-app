const prisma = require("./client");
const { faker } = require("@faker-js/faker");

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

  for (const u of users) {
    await prisma.user.create({
      data: {
        ...u,
        profile: {
          create: {
            name: u.name,
            username: u.username,
            email: u.email,
            pfp: "default-png.jpg",
          },
        },
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
