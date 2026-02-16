// Role-based access middleware
module.exports = function requireRole(...roles) {
  return (req, res, next) => {
    const user =
      req.user || req.auth || req.decoded || (req.session && req.session.user);
    if (!user || !roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};
