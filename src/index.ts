/* R E S O U R C E S */
import "./assets/styles/main.scss";

import { Chat } from "./assets/ts/chat";
import { ChatUserstate } from "tmi.js";
const chat: Chat = new Chat("freiheitstream");

import { Bar } from "./assets/ts/charts/bar";
import { Chart } from "./assets/ts/charts/chart";
import { Pie } from "./assets/ts/charts/pie";

const bar: Chart = new Pie("bar"); // new Bar("bar");
if (bar.error) {
  console.error(bar.error);
} else {
  bar.draw([33, 50, 100 - (33 + 50)], true, true);
}

let num = 0;
chat.client.on(
  "message",
  (
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean
  ) => {
    num++;
    bar.draw([num, 100]);
  }
);
