"use client";

import { Circle, Rect } from "react-konva";
import { BoardItemModel } from "../../types/board";

type Props = {
  item: BoardItemModel;
  onMove: (id: string, x: number, y: number) => void;
};

export default function BoardItem({ item, onMove }: Props) {
  if (item.type === "circle") {
    return (
      <Circle
        x={item.x}
        y={item.y}
        radius={32}
        fill="#E8F5E9"
        stroke="#2E7D32"
        strokeWidth={2}
        draggable
        onDragMove={(e) => onMove(item.id, e.target.x(), e.target.y())}
      />
    );
  }

  // rect (центр зручніше тримати як x/y в центрі)
  return (
    <Rect
      x={item.x - 40}
      y={item.y - 28}
      width={80}
      height={56}
      cornerRadius={12}
      fill="#E3F2FD"
      stroke="#1565C0"
      strokeWidth={2}
      draggable
      onDragMove={(e) => onMove(item.id, e.target.x() + 40, e.target.y() + 28)}
    />
  );
}
