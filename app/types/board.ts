import type { IconType } from "../assets/board/iconRegistry";

export type Tool = "select" | IconType;

export type BoardItemModel = {
  id: string;
  type: IconType;
  x: number;
  y: number;

  label?: string;
  seats?: number;
  people?: number;
};
