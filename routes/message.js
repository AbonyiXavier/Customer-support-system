const express = require("express");
const message = express.Router();
const cors = require("cors");
message.use(cors());

const Message = require("../Models/message");

message.post("/message", async (req, res) => {
  try {
    const mgs = await Message.create({
      messageType: req.body.messageType,
      messageContent: req.body.messageContent,
    });
    return res.send({
      mgs,
      message: "message created successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = message;
