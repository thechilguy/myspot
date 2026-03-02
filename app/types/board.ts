export type Tool = "select" | "rect" | "circle" | "table";
export type BoardItemType = "rect" | "circle" | "table";

export type BoardItemModel = {
  id: string;
  type: BoardItemType;
  x: number;
  y: number;

  // table-only info
  seats?: number;
  label?: string; // "T-01", "T-02"...
  status?: "free" | "reserved" | "busy";
};
