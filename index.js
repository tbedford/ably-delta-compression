const Ably = require('ably');
const vcdiffPlugin = require('@ably/vcdiff-decoder');
require('dotenv').config()
const key = process.env.API_KEY;

const realtime = new Ably.Realtime({
    key: key,
    plugins: {
        vcdiff: vcdiffPlugin
    },
    log: { level: 4 }
});

const channel = realtime.channels.get('ably-time-server', {
    params: {
        delta: 'vcdiff'
    }
})

channel.subscribe(msg => console.log("Received message: ", msg));

