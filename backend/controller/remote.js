const prisma = require("../prisma/client");
const { hashPass } = require("../utils/password");

async function signup(req, res) {
  try {
    const { name, username, email, password } = req.body;
    const saltHash = await hashPass(password);
    await prisma.user.create({
      data: {
        name: name,
        username: username,
        email: email,
        saltedHash: saltHash,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ errorMsg: "Internal server error :^(" });
  }
}

module.exports = {
  signup,
};
