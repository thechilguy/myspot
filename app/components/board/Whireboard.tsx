"use client";

import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { BoardItemModel, Tool } from "../../types/board";
import BoardItem from "../board/BoardItem";

type Props = {
  tool: Tool;
  items: BoardItemModel[];
  onAdd: (item: Omit<BoardItemModel, "id">) => void;
  onMove: (id: string, x: number, y: number) => void;
};

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

  const handlePointerDown = () => {
    if (tool !== "rect" && tool !== "circle") return;

    const stage = stageRef.current;
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    onAdd({ type: tool, x: pos.x, y: pos.y });
  };

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
          <Layer>
            {items.map((it) => (
              <BoardItem key={it.id} item={it} onMove={onMove} />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
