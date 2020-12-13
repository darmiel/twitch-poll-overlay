/* R E S O U R C E S */
import "./assets/styles/main.scss";
import "./assets/img/img_bar.png";
import "./assets/img/img_pie.png";
import "./builder.html";

import { Job } from "./ts/job";
import { Reaction } from "./ts/keywords";
import { Chart } from "./ts/charts/chart";
import { Chat } from "./ts/chats/chat";
import { TwitchChat } from "./ts/chats/twitch.chat";
import { ReactionStorage, UpdateMode } from "./ts/reactionstorage";
import { Pie } from "./ts/charts/pie";
import { Bar } from "./ts/charts/bar";
import { CanvasAnimation, FadeDirection } from "./ts/animation";

// get channel from url
const params: URLSearchParams = new URLSearchParams(window.location.search);
const channel: string = params.get("channel") ?? "";

const timeout: number = parseInt(params.get("timeout") ?? "10");
const requiredPings: number = parseInt(params.get("requiredPings") ?? "5");

const job: Job = new Job(timeout, requiredPings);
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

const animation: CanvasAnimation = new CanvasAnimation("bar");

// clear bar after faded out
animation.on(
  "fadeEnd",
  (durationInMs: number, smoothness: number, dir: FadeDirection) => {
    console.log("fadeEnd:", durationInMs, smoothness, dir);

    if (dir == FadeDirection.OUT) {
      // clear bar
      chart.clear();
    }
  }
);

// ReactionStorage#on(update)
// This event is executed when a reaction count was incremented.
// In this event the chart should be (re)painted with the values from:
// ReactionStorage#getValues()
storage.on("update", (reaction: Reaction, value: number, mode: UpdateMode) => {
  console.log(
    "on: update =",
    value,
    mode,
    job.isActive(),
    mode == UpdateMode.INCREMENT
  );
  if (mode == UpdateMode.INCREMENT && job.isActive()) {
    storage.drawChart(chart);
  }
});

job.on("start", () => {
  console.log("Job started!");

  storage.drawChart(chart);

  // fade in
  animation.fade(500, 25, FadeDirection.IN);
});

job.on("cancel", () => {
  console.log("Job canceled!");

  // reset values
  storage.resetStorage();

  animation.fade(500, 25, FadeDirection.OUT);
});