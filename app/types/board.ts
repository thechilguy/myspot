export type Tool = "select" | "rect" | "circle";

export type BoardItemType = "rect" | "circle";

export type BoardItemModel = {
  id: string;
  type: BoardItemType;
  x: number;
  y: number;
};
