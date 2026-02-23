"use client";
import { useEffect, useRef } from "react";
import { Circle, Rect } from "react-konva";
import { BoardItemModel } from "../../types/board";

type Props = {
  item: BoardItemModel;
  onMove: (id: string, x: number, y: number) => boolean; // ✅ boolean
  draggable: boolean;
};

export default function BoardItem({ item, onMove, draggable }: Props) {
  const lastGood = useRef({ x: item.x, y: item.y });

  // якщо позицію змінили ззовні (state), синхронізуємо lastGood
  useEffect(() => {
    lastGood.current = { x: item.x, y: item.y };
  }, [item.x, item.y]);

  if (item.type === "circle") {
    return (
      <Circle
        x={item.x}
        y={item.y}
        radius={32}
        fill="#E8F5E9"
        stroke="#2E7D32"
        strokeWidth={2}
        draggable={draggable}
        onDragMove={(e) => {
          const nx = e.target.x();
          const ny = e.target.y();
          const ok = onMove(item.id, nx, ny);

          if (!ok) {
            // ❌ відкат
            e.target.position(lastGood.current);
          } else {
            // ✅ фіксуємо
            lastGood.current = { x: nx, y: ny };
            // щоб візуально теж було snap-значення (state може встигнути не одразу)
            e.target.position({ x: nx, y: ny });
          }
        }}
      />
    );
  }

  // rect: в state зберігаємо ЦЕНТР, а в Konva позиція — top-left
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
      draggable={draggable}
      onDragMove={(e) => {
        const topLeftX = e.target.x();
        const topLeftY = e.target.y();

        const centerX = topLeftX + 40;
        const centerY = topLeftY + 28;

        const ok = onMove(item.id, centerX, centerY);

        if (!ok) {
          // відкат на lastGood (центр → top-left)
          e.target.position({
            x: lastGood.current.x - 40,
            y: lastGood.current.y - 28,
          });
        } else {
          lastGood.current = { x: centerX, y: centerY };
          e.target.position({ x: topLeftX, y: topLeftY });
        }
      }}
    />
  );
}
