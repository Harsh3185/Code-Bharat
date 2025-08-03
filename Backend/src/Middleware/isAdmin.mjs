const isAdmin = (req, res, next) => {
  if (req.user && req.user.role.toLowerCase() === 'admin') {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

export default isAdmin;
