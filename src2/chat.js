// import _ from 'lodash';
import tmi from "tmi.js";
import DOMPurify from "dompurify";

const params = new URLSearchParams(window.location.search);

function createBubble(channel, tags, message) {
  const element = document.createElement("div");
  let clean = DOMPurify.sanitize(message);

  // emotes!
  if (tags.emotes != null && tags.emotes != undefined) {
    clean = replaceEmoticons(clean, tags.emotes);
  }

  element.classList.add("bubble");

  element.innerHTML = `<small class="channel"><pre>${channel}</pre></small>
    <h3 
        class="username shadow" 
        style="color: ${tags.color} !important;"
    >${tags.username}:</h3>

    <span 
        class="message shadow"
    >${clean}</span>`;

  return element;
}

function replaceEmoticons(msg, emotes) {
  let message = msg;
  for (const emoteId in emotes) {
    const replacementArray = emotes[emoteId];
    for (let i = replacementArray.length - 1; i >= 0; i--) {
      const copy = message;

      const replacement = replacementArray[i].split("-");
      const start = parseInt(replacement[0]);
      const end = parseInt(replacement[1]);

      const imgComponent = `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0">`;

      message =
        copy.substring(0, start) + imgComponent + message.substring(end + 1);
    }
  }
  return message;
}

// just some example channels (with decent chat activity) for now
const channels = [
  "trymacs",
  "unsympathisch_tv",
  "INSCOPE21TV",
  "AnniTheDuck",
  "rewinside",
  "RevedRV",
  "kuhlewuLIVE",
  "ELoTRiX",
  "SizzleBrothers",
];

// create chat
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [], // no channels by default,
});

console.log("> Connecting to TMI ...");
client.connect();
console.log("> Connected");

/*
 * Events
 */
client.on("message", async (channel, tags, message, self) => {
  // add bubble
  document
    .getElementById("chat")
    .appendChild(createBubble(channel, tags, message));

  // scroll to bottom
  window.scrollTo(0, document.body.scrollHeight);
});

module.exports = {
    switchChannelByName: function() {
        console.log("Test123");
    }
}

function switchChannelByName(channel) {
  console.log("> Switching to channel #" + channel);
  client.disconnect();
  client.getChannels().splice(0, client.getChannels().length);
  client.getChannels().push(channel);
  client.connect();
}