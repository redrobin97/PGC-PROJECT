function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    res.status(401);
    next({
      name: "MissingSecurityClearance",
      message: "This function is reserved for Admin only",
    });
  }
  next();
}

module.exports = { requireUser, requireAdmin };
