import { Chart, ChartProperties, ChartType } from "../charts/chart";
import { Bar, BarProperties } from "../charts/bar";
import { Pie, PieProperties } from "../charts/pie";
import { reactions, updateReactions } from "../keywords";

export class Settings implements ChartProperties, PieProperties, BarProperties {
  public channel: string = null;
  public timeout: number = 10;
  public requiredPings: number = 5;
  public type: ChartType = ChartType.BAR;

  // animation: fade in
  public afid: number = 500; // duration
  public afis: number = 25; // smoothness
  //animation: fade out
  public afod: number = 500; // duration
  public afos: number = 25; // smoothnes

  public background: string = "none";

  // Chart Properties
  public readonly elementId: string = "canvas";
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  // Bar Properties
  public barMarginHeight: number;
  public barMarginWidth: number;
  public strokeMarginHeight: number;
  public strokeMarginWidth: number;
  public valueColors: string[];
  public strokeColor: string;
  public strokeIterations: number;
  public fontSizeFactor: number;
  public textRound: boolean;

  // Pie Properties
  public round: boolean;
  public radiusFactor: number;

  // Font Properties
  public fontSize: number;
  public fontFamily: string;
  public fontColorFactor: number;

  // reactions
  public reactionsJson: string = "";

  constructor() {
    const params: URLSearchParams = new URLSearchParams(window.location.search);

    console.log("Loading settings ...");
    params.forEach((value: string, key: string, _) => {
      try {
        this[key] = value;
      } catch (ex) {
        throw new Error(ex);
      }
    });
  }

  public buildChart(): Chart {
    switch (settings.type) {
      case ChartType.PIE:
        const defaultPieProperties: PieProperties = {
          x: -1,
          y: -1,
          radiusFactor: 2,
        };
        console.log("Building pie");
        return new Pie({ ...this, ...defaultPieProperties });
      default:
        const defaultBarProperties: BarProperties = {
          barMarginHeight: 0,
          barMarginWidth: 0,
          strokeMarginHeight: 0,
          strokeMarginWidth: 0,
        };
        console.log("Building bar");
        return new Bar({ ...this, ...defaultBarProperties });
    }
  }
}

const settings: Settings = new Settings();

// custom reactions
if (settings.reactionsJson.trim().length > 0) {
  const json: any = JSON.parse(settings.reactionsJson);
  updateReactions(json);

  console.log("Using custom reactions:", json, "=>", reactions);
}

export { settings };
