import _ from 'lodash';
import tmi from 'tmi.js';

const channel = "trymacs";

// create chat
const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [

    ]
})