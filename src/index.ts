/* R E S O U R C E S */
import "./assets/styles/main.scss";

import { Job } from "./ts/job";
import { Chat } from "./ts/chat";
import { Reaction } from "./ts/keywords";
import { Bar } from "./ts/charts/bar";
import { Pie } from "./ts/charts/pie";
import { Chart } from "./ts/charts/chart";

// get channel from url
const params: URLSearchParams = new URLSearchParams(window.location.search);
const channel: string = params.has("channel") ? params.get("channel") : "";

const job: Job = new Job(10, 5);
const chat: Chat = new Chat(channel, job);

let drawing: boolean = false;

function buildChartFromParams(): Chart {
  const type = params.has("type") ? params.get("type") : null; // null = bar

  // return bar
  if (type == "pie") {
    return new Pie({
      elementId: "bar",
      background: "none",
      x: -1,
      y: -1,
      radiusFactor: 2
    });
  } else {
    return new Bar({
      elementId: "bar",
      // height: 50,
      background: "none",
      barMarginHeight: 0,
      barMarginWidth: 0,
      strokeMarginHeight: 0,
      strokeMarginWidth: 0,
    });
  }
}

const chart: Chart = buildChartFromParams();

// ping reaction
chat.on("reaction", (channel: string, reaction: Reaction, value: number) => {
  console.log("reaction");

  job.ping();

  if (drawing) {
    redrawChart();
  }
});

job.on("start", () => {
  drawing = true;

  console.log("Job started!");
  redrawChart();
});

job.on("cancel", () => {
  drawing = false;

  console.log("Job canceled!");

  // clear bar
  chart.clear();

  // reset values
  chat.resetValues();
});

function redrawChart(): void {
  // get values
  const values: number[] = chat.getValues();
  chart.draw(values, true, true);
}
