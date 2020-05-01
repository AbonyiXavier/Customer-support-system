import jwt from "jsonwebtoken";

const Auth = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("my token", token);
  if (!token) {
    return res.status(401).json({
      status: "failure",
      message: "No access token provided!",
    });
  }
  if (token) {
    try {
      jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
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
export default Auth;
