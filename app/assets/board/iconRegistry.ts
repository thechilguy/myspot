import { svgToDataUrl } from "../icons/toDataUrl";
import { tableRectSvg } from "../icons/tableRect";
import { tableRoundSvg } from "../icons/tableRound";

export type IconType = "tableRect" | "tableRound";

export const ICON_REGISTRY: Record<
  IconType,
  {
    src: string; // data url
    w: number; // render width
    h: number; // render height
    bounds: { halfW: number; halfH: number }; // collision bounds
  }
> = {
  tableRect: {
    src: svgToDataUrl(tableRectSvg),
    w: 120,
    h: 56,
    bounds: { halfW: 60, halfH: 28 },
  },
  tableRound: {
    src: svgToDataUrl(tableRoundSvg),
    w: 90,
    h: 90,
    bounds: { halfW: 45, halfH: 45 },
  },
};
