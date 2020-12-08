/* R E S O U R C E S */
import "./assets/styles/main.scss";

// get channel from url
const params: URLSearchParams = new URLSearchParams(window.location.search);
const channels: string[] = params.has("channel")
  ? params.getAll("channel")
  : [];

// warn if no channels in url params
if (channels.length === 0) {
  console.log("[!] Warning :: No channels selected!");
}

import { Job } from "./ts/job";

const job: Job = new Job(10);

import { Chat } from "./ts/chat";
import { Reaction } from "./ts/keywords";

const chat: Chat = new Chat(channels, job);

chat.on("reaction", (channel: string, reaction: Reaction, value: number) => {
  job.ping();
});

job.on("start", () => {
  console.log("Job started!");
})

job.on("cancel", () => {
  console.log("Job canceled!");
})