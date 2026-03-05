function isAuth(req, res) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}

module.exports = isAuth;
