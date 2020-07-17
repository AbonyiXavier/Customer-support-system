const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = express.Router();
const cors = require("cors");
const transporter = require("./transporter");
const upload = require("../middlewares/multer");
const moment = require("moment");

const User = require("../Models/User");
const signupValidation = require("../Models/signupValidation");
const signinValidation = require("../Models/signinValidation");
const isAdmin = require("../middlewares/admin");
const Auth = require("../middlewares/verifyToken");
users.use(cors());

process.env.SECRET_KEY = "secret";

users.post("/register", upload.single("profilePics"), async (req, res) => {
  console.log("profilePics", req.file);
  try {
    const { error } = signupValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const emailCheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    console.log("email", emailCheck);
    if (emailCheck) {
      return res.send({
        message: "Email already in use",
      });
    }

    const userData = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      profilePics: req.file.path,
      password: bcrypt.hashSync(req.body.password, 10),
      role: req.body.role,
      lastLoginDate: Date.now(),
    });
    // console.log("user", userData);
    const token = jwt.sign(
      { userData, role: userData.role },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 86400,
      }
    );
    const data = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      profilePics: userData.profilePics,
      role: userData.role,
    };
    data.token = token;
    res.header("Authorization", token).status(200).send({
      data,
      message: "User was registered successfully!",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

users.post("/auth/login", async (req, res) => {
  try {
    const { error } = signinValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).send({
        message: "User Not found.",
      });
    }
    var lastLoginDate = moment();
    console.log("date", lastLoginDate);
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        token: null,
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
      expiresIn: 86400, // 24 hours
    });
    // const data = {
    //   id: user.id,
    //   email: user.email,
    //   // password: user.password,
    // };
    // data.token = token;
    // data.lastLoginDate = lastLoginDate;
    return res.header("Authorization", token).status(200).send({
      // data,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      profilePics: user.profilePics,
      role: user.role,
      token,
      lastLoginDate,
      message: "User is successfully logged in!",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ message: error.message });
  }
});

users.post("/forgetPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await User.findOne({
      where: {
        email,
      },
    });
    console.log("result", result);
    if (result.length < 1) {
      return res.status(400).send({
        message: `Sorry an Account with Email: ${email} doesn't exist`,
      });
    } else {
      let secret = result.password;
      console.log("my secret", secret);
      const token = jwt.sign({ result }, secret, {
        expiresIn: 3600, // 1 hour
      });
      let url = `http://localhost:8080/recover/${result.id}-${token}`;
      var mailOptions = {
        from: "francisabonyi@gmail.com",
        to: email,
        subject: "FORGOT PASSWORD",
        html: `Hello ${result.firstName} ${result.lastName}, 
                <br>
                <br>
                There was a request to reset your password
                <br>
                <br>
                Please click on the button below to get a new password
                <br>
                <br>
                <a href='${url}'><button>Reset Password</button></a>
                <br>
                <br>
                If you did not make this request, just ignore this email as nothing has changed.
                <br>
                <br>
                Best Regards,
                <br>
                The Xavier's Team!`,
      };
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          return res.status(402).json({
            success: false,
            message: "Failed to send e-mail reset Link",
          });
        } else {
          return res.status(200).json({
            status: "success",
            message: `A password reset link has been sent to ${email}`,
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

users.post("/resetpasstoken/:id-:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    console.log("id", id);
    const { password } = req.body;

    const result = await User.findOne({
      where: {
        id,
      },
    });
    const secret = result.password;
    console.log("secret", secret);
    const payload = jwt.decode(token, secret);
    console.log("payload details", payload);
    console.log("payload id", payload.id);
    if (payload.id == id) {
      bcrypt.genSalt(10, (err, salt) => {
        console.log("my err", err);
        if (err) return;
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) return;
          User.update(
            { password: hash },
            {
              where: {
                id: id,
              },
            }
          );
        });
        res.status(200).json({
          message: "Password changed accepted",
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//Get Users
users.get("/getusers", async (req, res) => {
  try {
    const user = await User.findAll();
    res.send({
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

users.get("/getusers/me", Auth, async (req, res) => {
  try {
    var user = await User.findOne({
      where: {
        id: req.user.user.id,
      },
    });
    // console.log(user);
    delete user.dataValues.password;
    res.send({
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

users.patch("/user/:id", async (req, res) => {
  try {
    const getMe = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (getMe) {
      if (req.body.firstName) getMe.firstName = req.body.firstName;
      if (req.body.lastName) getMe.lastName = req.body.lastName;
      if (req.body.email) getMe.email = req.body.email;
      if (req.body.phoneNumber) getMe.phoneNumber = req.body.phoneNumber;
      if (req.body.profilePics) getMe.profilePics = req.body.profilePics;
      // console.log("get me", getMe);

      const dataIn = {
        firstName: getMe.firstName,
        lastName: getMe.lastName,
        email: getMe.email,
        phoneNumber: getMe.phoneNumber,
        profilePics: getMe.profilePics,
      };

      const data = await User.update(dataIn, {
        where: {
          id: req.params.id,
        },
      });
      // console.log("data id", data);
      if (data) {
        res.send({
          data,
          message: "User was updated successfully",
        });
      } else {
        res.send({
          message: `Cannot update user with id = ${id}`,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating user",
    });
  }
});

users.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.destroy({
      where: {
        id,
      },
    });
    if (data) {
      res.send({
        data,
        message: "user was deleted successfully",
      });
    } else {
      res.send({
        message: `Cannot delete user with id = ${id}`,
      });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = users;
