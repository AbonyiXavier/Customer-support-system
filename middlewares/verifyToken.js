const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
  let token = req.header("Authorization");
  // console.log("token", token);
  const touch = token.split(" ")[1];

  console.log("token touch", touch);
  if (!touch) {
    return res.status(401).json({
      status: "failure",
      message: "No access token provided!",
    });
  }
  if (touch) {
    try {
      jwt.verify(touch, process.env.TOKEN_SECRET, function (err, decoded) {
        console.log("my name", decoded);
        req.user = decoded;
        next();
      });
      // console.log(req.user);
    } catch (error) {
      return res.status(400).send({
        status: "failure",
        message: "Invalid Token!",
      });
    }
  }
};
module.exports = Auth;
