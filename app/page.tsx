"use client";

import { useState } from "react";
import Toolbar from "../app/components/toolbar/Toolbar";
import Whiteboard from "../app/components/board/Whireboard";
import { BoardItemModel, Tool } from "../app/types/board";
import TableModal from "../app/components/modals/TableModal";

const GRID = 20;
const snap = (v: number) => Math.round(v / GRID) * GRID;

// must match BoardItem sizes
const CIRCLE_R = 32;
const RECT_HALF_W = 40;
const RECT_HALF_H = 28;

// table bounds (tableW=90, tableH=60 + chairs padding)
const TABLE_HALF_W = 90 / 2 + 28;
const TABLE_HALF_H = 60 / 2 + 24;

type Bounds = { left: number; right: number; top: number; bottom: number };

function getBounds(item: Pick<BoardItemModel, "type" | "x" | "y">): Bounds {
  if (item.type === "circle") {
    return {
      left: item.x - CIRCLE_R,
      right: item.x + CIRCLE_R,
      top: item.y - CIRCLE_R,
      bottom: item.y + CIRCLE_R,
    };
  }
  if (item.type === "rect") {
    return {
      left: item.x - RECT_HALF_W,
      right: item.x + RECT_HALF_W,
      top: item.y - RECT_HALF_H,
      bottom: item.y + RECT_HALF_H,
    };
  }
  return {
    left: item.x - TABLE_HALF_W,
    right: item.x + TABLE_HALF_W,
    top: item.y - TABLE_HALF_H,
    bottom: item.y + TABLE_HALF_H,
  };
}

function overlaps(a: Bounds, b: Bounds, padding = 2) {
  return !(
    a.right + padding <= b.left ||
    a.left - padding >= b.right ||
    a.bottom + padding <= b.top ||
    a.top - padding >= b.bottom
  );
}

function wouldCollide(
  items: BoardItemModel[],
  movingId: string,
  nx: number,
  ny: number,
) {
  const me = items.find((i) => i.id === movingId);
  if (!me) return false;

  const nextB = getBounds({ type: me.type, x: nx, y: ny });
  return items.some((o) => o.id !== movingId && overlaps(nextB, getBounds(o)));
}

export default function Home() {
  const [tool, setTool] = useState<Tool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [items, setItems] = useState<BoardItemModel[]>([]);

  const opened = items.find((i) => i.id === openId) ?? null;

  const addItem = (item: Omit<BoardItemModel, "id">) => {
    const x = snap(item.x);
    const y = snap(item.y);

    const newItem: BoardItemModel = {
      id: String(Date.now()) + Math.random().toString(16).slice(2),
      ...item,
      x,
      y,
    };

    setItems((prev) => {
      const b = getBounds(newItem);
      const hit = prev.some((o) => overlaps(b, getBounds(o)));
      if (hit) return prev;
      return [...prev, newItem];
    });

    setSelectedId(newItem.id);
    setTool("select");
  };

  const moveItem = (id: string, x: number, y: number): boolean => {
    const nx = snap(x);
    const ny = snap(y);

    let accepted = false;

    setItems((prev) => {
      if (wouldCollide(prev, id, nx, ny)) {
        accepted = false;
        return prev;
      }
      accepted = true;
      return prev.map((p) => (p.id === id ? { ...p, x: nx, y: ny } : p));
    });

    return accepted;
  };

  return (
    <div className="h-screen w-screen bg-zinc-100 p-4">
      <div className="mx-auto flex h-full max-w-6xl flex-col gap-3">
        <Toolbar activeTool={tool} onChange={setTool} />

        <div className="flex-1 min-h-0">
          <Whiteboard
            tool={tool}
            items={items}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onOpen={(id) => setOpenId(id)}
            onAdd={addItem}
            onMove={moveItem}
          />
        </div>
      </div>

      {opened && opened.type === "table" && (
        <TableModal item={opened} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
