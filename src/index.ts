/* R E S O U R C E S */
import "./assets/styles/main.scss";

import { Job } from "./ts/job";
import { Reaction } from "./ts/keywords";
import { Chart } from "./ts/charts/chart";
import { Chat } from "./ts/chats/chat";
import { TwitchChat } from "./ts/chats/twitch.chat";
import { ReactionStorage, UpdateMode } from "./ts/reactionstorage";
import { Pie } from "./ts/charts/pie";
import { Bar } from "./ts/charts/bar";

// get channel from url
const params: URLSearchParams = new URLSearchParams(window.location.search);
const channel: string = params.get("channel") ?? "";

const job: Job = new Job(10, 5);
const chat: Chat = new TwitchChat(channel);

function buildChartFromParams(): Chart {
  const type = params.has("type") ? params.get("type") : null; // null = bar

  // return bar
  if (type == "pie") {
    return new Pie({
      elementId: "bar",
      background: "none",
      x: -1,
      y: -1,
      radiusFactor: 2,
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

const storage: ReactionStorage = new ReactionStorage(chat, job);

// ReactionStorage#on(update)
// This event is executed when a reaction count was incremented.
// In this event the chart should be (re)painted with the values from:
// ReactionStorage#getValues()
storage.on("update", (reaction: Reaction, value: number, mode: UpdateMode) => {
  console.log("on: update =", value, mode, job.isActive(), mode == UpdateMode.INCREMENT);
  if (mode == UpdateMode.INCREMENT && job.isActive()) {
    storage.drawChart(chart);
  }
});

job.on("start", () => {
  console.log("Job started!");
});

job.on("cancel", () => {
  console.log("Job canceled!");

  // clear bar
  chart.clear();

  // reset values
  storage.resetStorage();
});