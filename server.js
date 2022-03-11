const express = require("express");
const bodyParser = require("body-parser");
const randomWords = require('random-words');
const channeName = "ably-data-server";

require('dotenv').config()
const key = process.env.API_KEY;

const rest = new require("ably").Rest(key);
const channel = rest.channels.get(channelName);

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
  rest.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
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

const max = 4;  // add or remove up to this number of users
const initialUsers = 50;
let usernames = randomWords(initialUsers);

function addUsers(users) {
  for (let i = 0; i < Math.floor(Math.random() * max) + 1; i++) {
    users.push(randomWords());
  }
}

function removeUsers(users) {
  for (let i = 0; i < Math.floor(Math.random() * max) + 1; i++) {
    users.splice(Math.floor(Math.random() * users.length), 1);
  }
}

function onlineUsernames(usernames) {
  removeUsers(usernames);
  addUsers(usernames);
  console.log(usernames);
  console.log('Length: ' + usernames.length);
  return usernames;
}

function sendUserList() {
  channel.publish("userlist", onlineUsernames(usernames));
}

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);

  setInterval(sendUserList, process.env.INTERVAL);
});
