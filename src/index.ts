/* R E S O U R C E S */
import "./assets/styles/main.scss";

import { Job } from "./ts/job";
import { Chat } from "./ts/chat";
import { Reaction } from "./ts/keywords";
import { Bar } from "./ts/charts/bar";

// get channel from url
const params: URLSearchParams = new URLSearchParams(window.location.search);
const channel: string = params.has("channel") ? params.get("channel") : "";

const job: Job = new Job(10, 5);
const chat: Chat = new Chat(channel, job);

let drawing: boolean = false;

// ping reaction
chat.on("reaction", (channel: string, reaction: Reaction, value: number) => {
  job.ping();

  if (drawing) {
    redrawBar();
  }
});

const bar: Bar = new Bar({ elementId: "bar", height: 50, background: "none" });

// TODO: Show bar
job.on("start", () => {
  drawing = true;

  console.log("Job started!");
  redrawBar();
});

job.on("cancel", () => {
  drawing = false;

  console.log("Job canceled!");
  bar.clear();
});

function redrawBar(): void {
  // get values
  const values: number[] = chat.getValues();
  bar.draw(values, true, true);
}
