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
  const menaUser = await prisma.user.findUnique({
    where: { username: "mena" },
  });

  if (menaUser) {
    console.log("found mena");
  }

  if (!menaUser) {
    return;
  }

  const users = faker.helpers.multiple(createRandomUser, { count: 5 });

  for (const u of users) {
    const newUser = await prisma.user.create({
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

    const postCount = faker.number.int({ min: 3, max: 10 });
    for (let i = 0; i < postCount; i++) {
      await prisma.posts.create({
        data: {
          madeBy: newUser.id,
          msg: faker.lorem.sentence(),
        },
      });
    }

    const messageCount = faker.number.int({ min: 3, max: 4 });
    for (let i = 0; i < messageCount; i++) {
      await prisma.msgs.create({
        data: {
          senderID: newUser.id,
          receiverID: menaUser.id,
          message: faker.lorem.sentence(),
        },
      });
    }

    console.log(
      `Created user ${newUser.username} with posts and messages to mena`,
    );
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
