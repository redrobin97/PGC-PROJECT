function requireUser(req, res, next) {
  if (!req.user) {
    return next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
      status: 401,
    });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return next({
      name: "MissingSecurityClearance",
      message: "This function is reserved for Admin only",
      status: 401,
    });
  }
  next();
}

module.exports = { requireUser, requireAdmin };
