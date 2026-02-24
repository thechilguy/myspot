"use client";
import { useEffect, useRef } from "react";
import { Circle, Rect, Group } from "react-konva";
import { BoardItemModel } from "../../types/board";

type Props = {
  item: BoardItemModel;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void; // ✅ open modal
  onMove: (id: string, x: number, y: number) => boolean;
  draggable: boolean;
};

export default function BoardItem({
  item,
  selected,
  onSelect,
  onOpen,
  onMove,
  draggable,
}: Props) {
  const lastGood = useRef({ x: item.x, y: item.y });

  useEffect(() => {
    lastGood.current = { x: item.x, y: item.y };
  }, [item.x, item.y]);

  // ================= TABLE =================
  if (item.type === "table") {
    const tableW = 90;
    const tableH = 60;
    const chairR = 10;

    const seats = item.seats ?? 4;
    const leftCount = Math.floor(seats / 2);
    const rightCount = Math.ceil(seats / 2);

    const leftGap = tableH / (leftCount + 1);
    const rightGap = tableH / (rightCount + 1);

    return (
      <Group
        x={item.x}
        y={item.y}
        draggable={draggable}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect(item.id);
        }}
        onTouchStart={(e) => {
          e.cancelBubble = true;
          onSelect(item.id);
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onOpen(item.id);
        }}
        onDblTap={(e) => {
          e.cancelBubble = true;
          onOpen(item.id);
        }}
        onDragMove={(e) => {
          const nx = e.target.x();
          const ny = e.target.y();
          const ok = onMove(item.id, nx, ny);

          if (!ok) e.target.position(lastGood.current);
          else lastGood.current = { x: nx, y: ny };
        }}
      >
        {/* CHAIRS */}
        {Array.from({ length: leftCount }).map((_, i) => (
          <Circle
            key={`l-${i}`}
            x={-tableW / 2 - 18}
            y={-tableH / 2 + leftGap * (i + 1)}
            radius={chairR}
            fill="#F5F5F5"
            stroke="#444"
            strokeWidth={1}
          />
        ))}

        {Array.from({ length: rightCount }).map((_, i) => (
          <Circle
            key={`r-${i}`}
            x={tableW / 2 + 18}
            y={-tableH / 2 + rightGap * (i + 1)}
            radius={chairR}
            fill="#F5F5F5"
            stroke="#444"
            strokeWidth={1}
          />
        ))}

        {/* TABLE BODY (hit area) */}
        <Rect
          x={-tableW / 2}
          y={-tableH / 2}
          width={tableW}
          height={tableH}
          cornerRadius={14}
          fill="#E3F2FD"
          stroke={selected ? "#111" : "#1565C0"}
          strokeWidth={selected ? 3 : 2}
        />

        {/* SELECTION BORDER */}
        {selected && (
          <Rect
            x={-tableW / 2 - 25}
            y={-tableH / 2 - 25}
            width={tableW + 50}
            height={tableH + 50}
            cornerRadius={20}
            stroke="#111"
            strokeWidth={2}
            dash={[6, 6]}
            listening={false}
          />
        )}
      </Group>
    );
  }

  // ================= CIRCLE =================
  if (item.type === "circle") {
    const r = 32;

    return (
      <Circle
        x={item.x}
        y={item.y}
        radius={r}
        fill="#E8F5E9"
        stroke={selected ? "#111" : "#2E7D32"}
        strokeWidth={selected ? 3 : 2}
        draggable={draggable}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect(item.id);
        }}
        onDragMove={(e) => {
          const nx = e.target.x();
          const ny = e.target.y();
          const ok = onMove(item.id, nx, ny);

          if (!ok) e.target.position(lastGood.current);
          else lastGood.current = { x: nx, y: ny };
        }}
      />
    );
  }

  // ================= RECT =================
  const halfW = 40;
  const halfH = 28;

  return (
    <Rect
      x={item.x - halfW}
      y={item.y - halfH}
      width={halfW * 2}
      height={halfH * 2}
      cornerRadius={12}
      fill="#E3F2FD"
      stroke={selected ? "#111" : "#1565C0"}
      strokeWidth={selected ? 3 : 2}
      draggable={draggable}
      onMouseDown={(e) => {
        e.cancelBubble = true;
        onSelect(item.id);
      }}
      onDragMove={(e) => {
        const cx = e.target.x() + halfW;
        const cy = e.target.y() + halfH;
        const ok = onMove(item.id, cx, cy);

        if (!ok) {
          e.target.position({
            x: lastGood.current.x - halfW,
            y: lastGood.current.y - halfH,
          });
        } else {
          lastGood.current = { x: cx, y: cy };
        }
      }}
    />
  );
}
