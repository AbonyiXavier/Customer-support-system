const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

var Users = require("./routes/user");
var Issues = require("./routes/issues");
var Message = require("./routes/message");
app.use("/api", Users);
app.use("/api", Issues);
app.use("/api", Message);

var PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Started at Port : ${PORT}`);
});
