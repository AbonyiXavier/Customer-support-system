const accountSid = "AC6be57975c0532d4decbd0716d0a1bf50";
const authToken = "b8a947e8743d2fd6ca4aace94be9b483";
const client = require("twilio")(accountSid, authToken);

const sendSms = (phoneNumber, message) => {
  client.messages
    .create({
      body: message,
      from: "+15103301872",
      to: phoneNumber,
    })
    .then((message) => console.log(message.sid));
};

module.exports = sendSms;
