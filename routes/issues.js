const express = require("express");
const issues = express.Router();
const transporter = require("./transporter");
const cors = require("cors");
issues.use(cors());

const Issue = require("../Models/issues");
const upload = require("../middlewares/multer");
const sendSms = require("../send_sms");

issues.post("/complaints", upload.single("profilePics"), async (req, res) => {
  console.log("my file", req.file.path);
  try {
    let { isCustomer, phoneNumber } = req.body;
    if (req.body.contractNumber) {
      isCustomer = true;
    } else {
      isCustomer = false;
    }
    const data = await Issue.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      categoryOfIssues: req.body.categoryOfIssues,
      contractNumber: req.body.contractNumber,
      consumptionType: req.body.consumptionType,
      billingPeriod: req.body.billingPeriod,
      billingYear: req.body.billingYear,
      openingBalance: req.body.openingBalance,
      currentCharges: req.body.currentCharges,
      closingBalance: req.body.closingBalance,
      previousClosingBalance: req.body.previousClosingBalance,
      trackingId: req.body.trackingId,
      amountPaid: req.body.amountPaid,
      paymentDate: req.body.paymentDate,
      channelOfPayment: req.body.channelOfPayment,
      facilityName: req.body.facilityName,
      location: req.body.location,
      maintenanceType: req.body.maintenanceType,
      descriptionOfIssues: req.body.descriptionOfIssues,
      profilePics: req.file.path,
      address: req.body.address,
      status: req.body.status ? req.body.status : "pending",
      isCustomer: isCustomer,
    });

    const newMessage =
      "Welcome to KADSWA. Your message is received. We shall treat accordingly. Thanks";

    sendSms(phoneNumber, newMessage);

    // const mailOptions = {
    //   from: "Michael <douglasjoseph166@gmail.com>",
    //   to: req.body.email,
    //   subject: "Complaints from customer",
    //   html:
    //     "Welcome to KADSWA. Your message is received. We shall treat accordingly. Thanks",
    // };

    // transporter.sendMail(mailOptions, function (err, data) {
    //   if (err) {
    //     console.log("my error", err);
    //     return res.json({
    //       status: "fail",
    //     });
    //   } else {
    //     console.log("Email sent to: " + data.response);
    //     return res.json({
    //       status: "success",
    //     });
    //   }
    // });

    return res.send({
      data: data,
      message: "Issues created successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

//Get Users
issues.get("/getcomplaints", async (req, res) => {
  try {
    const complaint = await Issue.findAll();
    res.send(complaint);
  } catch (error) {
    console.log("error", error);
  }
});

issues.get("/complaints/:id", async (req, res) => {
  try {
    const data = await Issue.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.send({
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error retrieving a complain",
    });
  }
});

issues.patch("/complaints/:id", async (req, res) => {
  console.log(req.body);
  console.log(req.params);
  try {
    const id = req.params.id;

    const data = await Issue.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id,
        },
      }
    );
    res.send({
      data,
      message: " issue was updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error updating complain",
    });
  }
});

module.exports = issues;
