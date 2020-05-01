const isAdmin = (req, res, next) => {
  console.log("Admin area stuff", req.user.is_admin);
  if (!req.user.is_admin) {
    return res.status(401).json({
      status: 401,
      message: "You are not an admin",
    });
  }
  next();
};
export default isAdmin;
