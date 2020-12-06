/* R E S O U R C E S */
import "./assets/styles/main.scss";

import { Chat } from "./ts/chat";
import { ChatUserstate } from "tmi.js";
const chat: Chat = new Chat("freiheitstream");

import { Bar } from "./ts/charts/bar";
import { Chart } from "./ts/charts/chart";
import { Pie } from "./ts/charts/pie";

const charts: Array<Chart> = [
  new Bar("bar"), 
  new Pie("pie")
];

for (let i: number = 0; i < charts.length; i++) {
  const chart: Chart = charts[i];

  if (chart.error) {
    console.error(chart.error);
  } else {
    chart.draw([33, 50, 100 - (33 + 50)], true, true);
  }
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
    const values = [num, 100, 50];

    for (let i: number = 0; i < charts.length; i++) {
      const chart: Chart = charts[i];
      chart.draw(values);
    }
  }
);
