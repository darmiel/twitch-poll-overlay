// colors for the bar
const colors: Array<string> = [
  "#3498db",
  "#f1c40f",
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#1abc9c",
  "#9b59b6",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#ecf0f1",
];
// export colors
export { colors };

export function RGB2Hex(r: number, g: number, b: number, leadingHash: boolean = true): string {
  const rgb: number = ((r << 16) | (g << 8) | b) & 0xffffff;
  const hex = rgb.toString(16);
  return (leadingHash ? "#" : "") + hex;
}

export function Hex2RGB(hex: string): Array<number> {
  if (hex.startsWith("#")) {
    hex = hex.substring(1);
  }

  const rgb: number = parseInt(hex, 16);

  return [
    /* R */ (rgb >> 16) & 0xff,
    /* G */ (rgb >> 8) & 0xff,
    /* B */ rgb & 0xff,
  ];
}

export function darkenRGBColor(
  r: number,
  g: number,
  b: number,
  mp: number
): string {
  r = Math.max(0, r * mp);
  g = Math.max(0, g * mp);
  b = Math.max(0, b * mp);
  return RGB2Hex(r, g, b);
}

export function darkenHexColor(hex: string, mp: number): string {
  const rgb = Hex2RGB(hex);
  const hex2 = darkenRGBColor(rgb[0], rgb[1], rgb[2], mp);
  return hex2;
}
