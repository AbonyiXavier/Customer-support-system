const express = require("express");
const issues = express.Router();
const transporter = require("./transporter");
const cors = require("cors");
issues.use(cors());

const Issue = require("../Models/issues");

issues.post("/complains", async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      contract_number,
      //   category,
      message,
      status,
    } = req.body;
    const data = await Issue.create({
      full_name,
      email,
      phone,
      contract_number,
      //   category,
      message,
      status,
    });
    const mailOptions = {
      from: req.body.email,
      to: "Michael <olawuni.michael@gmail.com>",
      subject: "Complains from customer",
      html:
        "Welcome to KADSWA. Your message is received. We shall treat accordingly. Thanks",
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("my error", err);
        res.json({
          status: "fail",
        });
      } else {
        console.log("Email sent to: " + data.response);
        res.json({
          status: "success",
        });
      }
    });

    res.send({
      data: data,
      message: "Issues created successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

issues.get("/complains", async (req, res) => {
  try {
    const results = await Issue.findAll();
    res.send({
      results: results,
    });
  } catch (error) {
    res.status(400).send({
      message: "There was an error getting all complains",
    });
  }
});

issues.get("/complains/:id", async (req, res) => {
  try {
    const data = await Issue.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.send({
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error retrieving a complain",
    });
  }
});

issues.put("/complains/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Issue.update(req.body, {
      where: {
        id: id,
      },
    });
    if (data == 1) {
      res.send({
        data: data,
        message: "complain was updated successfully",
      });
      const mailOptions = {
        from: "Xavier <francisabonyi@gmail.com>",
        to: req.body.email,
        subject: "update on customer Complains",
        html: "From KADSWA. Your complain is resolved. Thanks",
      };

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("my error", err);
          res.json({
            status: "fail",
          });
        } else {
          console.log("Email sent to: " + data.response);
          res.json({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        message: `Cannot update complain with id=${id}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error updating complain",
    });
  }
});

module.exports = issues;
