const express = require("express");
const bodyParser = require("body-parser");
const randomWords = require('random-words');
const words = randomWords(400); // create a block of data consisting of 400 random words

require('dotenv').config()
const key = process.env.API_KEY;

const ably = new require("ably").Rest(key);
const channel = ably.channels.get("ably-data-server");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// tokenrequest based authentication
app.get("/auth", (req, res) => {
  const tokenParams = {
    ttl: 1000 * 60 * 60 * 1, // one hour
    clientId: "client1@example.com",
  };
  ably.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
    if (err) {
      console.error("Bang");
      res
        .status(500)
        .send("Error requesting TokenRequest: " + JSON.stringify(err));
    } else {
      let timestamp = new Date().toLocaleString();
      console.log("Token request issued at: " + timestamp);
      console.log(tokenRequest);
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(tokenRequest));
    }
  });
});

function sendDataBlock() {
  const time = new Date();
  channel.publish("dataBlock", words + randomWords(2));
  return;
}

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);

  setInterval(sendDataBlock, process.env.INTERVAL);
});
