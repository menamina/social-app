const bcrypt = require("bcrypt");

function hashPass(password) {
  const rounds = 15;
  const saltedHash = bcrypt.hash(password, rounds);
  return saltedHash;
}

function checkPassword(enteredPassword, saltedHash) {
  const match = bcrypt.compare(enteredPassword, saltedHash);
  return match;
}

module.exports = { hashPass, checkPassword };
