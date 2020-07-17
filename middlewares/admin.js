const isAdmin = (req, res, next) => {
  // console.log("Admin area stuff", req.user.role);
  console.log("Admin area stuff", req.user.user.role);
  if (req.user.user.role !== "Admin") {
    return res.status(401).json({
      status: 401,
      message: "You are not an admin",
    });
  }
  return next();
};
module.exports = isAdmin;
