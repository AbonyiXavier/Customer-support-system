const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = express.Router();
const cors = require("cors");
const transporter = require("./transporter");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const User = require("../Models/User");
const signupValidation = require("../Models/signupValidation");
const signinValidation = require("../Models/signinValidation");
users.use(cors());

process.env.SECRET_KEY = "secret";

users.post("/register", upload.single("image"), (req, res) => {
  console.log("my file", req.file);
  const { error } = signupValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
    image: req.file.path,
    is_admin: req.body.is_admin,
  };

  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (!user) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        userData.password = hash;
        const token = jwt.sign(userData, process.env.SECRET_KEY, {
          expiresIn: 86400, // 24 hours
        });
        res.cookie("token", token);
        User.create(userData).then((user) => {
          res.status(201).json({
            user,
            token,
          });
          const url = `https://kadswacustomer.netlify.app/${token}`;

          const mailOptions = {
            from: "Xavier Francis <francisabonyi@gmail.com>",
            to: req.body.email,
            subject: "kadswacustomer account confirmation",
            html: `Please click this link to confirm your account with us: <a href="${url}">${url}</a>`,
          };

          transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
              console.log("my error", err);
              res.json({
                status: "fail",
              });
            } else {
              console.log("Email sent: " + data.response);
              res.json({
                status: "success",
              });
            }
          });
        });
      });
    }
  });
});

users.post("/login", (req, res) => {
  const { error } = signinValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
          { id: user.id, is_admin: user.is_admin },
          process.env.SECRET_KEY,
          {
            expiresIn: 60 * 24, // 24hours
          }
        );
        res.header("Authorization", token).status(201).json({
          token,
          status: "success",
          message: "logged in!",
          user: user,
        });
      }
    } else {
      res.json({
        status: "error",
        message: "user does not exist",
      });
    }
  });
});

users.get("/confirmEmail/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.SECRET_KEY);
    const data = User.update(
      // {
      //   confirm: true,
      // },
      {
        where: {
          id: decoded.id,
        },
      }
    );
    res.send({
      data,
    });
  } catch (error) {
    res.status(400).send({
      error: "An error occured while trying to confirm your email",
    });
  }
});

module.exports = users;
