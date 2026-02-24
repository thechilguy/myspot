export type Tool = "select" | "rect" | "circle" | "table";
export type BoardItemType = "rect" | "circle" | "table";

export type BoardItemModel = {
  id: string;
  type: BoardItemType;
  x: number;
  y: number;

  seats?: number; // table
  label?: string; // table info, напр "T-01"
};
