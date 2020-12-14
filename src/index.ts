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
import { CanvasAnimation, FadeDirection } from "./ts/animation";
import { settings } from "./ts/param/params";

console.log(settings);

const job: Job = new Job(settings.timeout, settings.requiredPings);
const chat: Chat = new TwitchChat(settings.channel);
const chart: Chart = settings.buildChart();
const storage: ReactionStorage = new ReactionStorage(chat, job);
const animation: CanvasAnimation = new CanvasAnimation(settings.elementId);

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
  animation.fade(settings.afid, settings.afis, FadeDirection.IN);
});

job.on("cancel", () => {
  console.log("Job canceled!");

  // reset values
  storage.resetStorage();

  animation.fade(settings.afod, settings.afos, FadeDirection.OUT);
});
