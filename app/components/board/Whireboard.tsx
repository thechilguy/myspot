"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Layer, Stage, Line } from "react-konva";
import { BoardItemModel, Tool } from "../../types/board";
import BoardItem from "../board/BoardItem";

type Props = {
  tool: Tool;
  items: BoardItemModel[];
  onAdd: (item: Omit<BoardItemModel, "id">) => void;
  onMove: (id: string, x: number, y: number) => void;
};

const GRID = 20;

export default function Whiteboard({ tool, items, onAdd, onMove }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<any>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      setSize((p) => (p.w === w && p.h === h ? p : { w, h }));
    };

    update();
    const ro = new ResizeObserver(() => requestAnimationFrame(update));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ready = size.w > 0 && size.h > 0;

  const handlePointerDown = (e: any) => {
    if (tool !== "rect" && tool !== "circle") return;

    // ✅ створюємо тільки якщо клік по пустому фону Stage
    const clickedOnEmpty = e.target === e.target.getStage();
    if (!clickedOnEmpty) return;

    const stage = stageRef.current;
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    onAdd({ type: tool, x: pos.x, y: pos.y });
  };

  // ✅ Готуємо лінії сітки один раз на кожну зміну size
  const gridLines = useMemo(() => {
    if (!ready) return [];

    const lines: React.ReactNode[] = [];

    for (let x = GRID; x < size.w; x += GRID) {
      lines.push(
        <Line
          key={`vx-${x}`}
          points={[x, 0, x, size.h]}
          stroke="#000"
          strokeWidth={1}
          opacity={0.06}
          listening={false}
        />,
      );
    }

    for (let y = GRID; y < size.h; y += GRID) {
      lines.push(
        <Line
          key={`hy-${y}`}
          points={[0, y, size.w, y]}
          stroke="#000"
          strokeWidth={1}
          opacity={0.06}
          listening={false}
        />,
      );
    }

    return lines;
  }, [ready, size.w, size.h]);

  return (
    <div
      ref={wrapRef}
      className="h-full w-full overflow-hidden rounded-2xl border bg-white"
    >
      {ready && (
        <Stage
          ref={stageRef}
          width={size.w}
          height={size.h}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          {/* grid layer */}
          <Layer listening={false}>{gridLines}</Layer>

          {/* items layer */}
          <Layer>
            {items.map((it) => (
              <BoardItem
                key={it.id}
                item={it}
                onMove={onMove}
                draggable={tool === "select"}
              />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
