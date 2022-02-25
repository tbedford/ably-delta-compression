# ably-delta-compression

A simple example of using Ably delta compression.

Uses the Stats API to compare compressed vs uncompressed data.

This demo simulates sending a list of online users to the client. Some users log off, some new users log on, and some continue to use the service. The client uses delta compression to obtain only the difference in the user list data packet.

## Usage

Clone the repo, then:

1. Copy the `example.env` file to `.env` and add your Ably key.
2. Change the port number and data update frequency as required.

To install the requirements and run the server:

```
npm install
npm start
```

Point your browser at http://localhost:9000 this displays a simple UI to demonstrate compression levels.

A node client (`node-client.js`) is also provided, so you can test from the command line.

## See also

* [Ably docs](https://ably.com/documentation/realtime/channels/channel-parameters/deltas)
