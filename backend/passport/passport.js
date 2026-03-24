const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkPassword } = require("../utils/password");
const prisma = require("../prisma/client");

const strategy = new LocalStrategy({ usernameField: "email" }, verifyCB);

async function verifyCB(email, password, done) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return done(null, false, { message: "invalid email" });
    }

    const match = await checkPassword(password, user.saltedHash);
    if (!match) {
      return done(null, false, { message: "invalid password" });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

passport.use(strategy);

module.exports = passport;
