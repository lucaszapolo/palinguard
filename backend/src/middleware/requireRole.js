const roleOrder = ["read", "support", "admin"];

export function requireRole(minRole) {
  return (req, res, next) => {
    const userRole = req.user?.role || "read";
    if (roleOrder.indexOf(userRole) < roleOrder.indexOf(minRole)) {
      return res.status(403).json({ error: "forbidden" });
    }
    return next();
  };
}
