"use client";

import { useState } from "react";
import Toolbar from "../app/components/toolbar/Toolbar";
import Whiteboard from "../app/components/board/Whireboard";
import { BoardItemModel, Tool } from "../app/types/board";

export default function Home() {
  const [tool, setTool] = useState<Tool>("select");
  const [items, setItems] = useState<BoardItemModel[]>([]);

  const addItem = (item: Omit<BoardItemModel, "id">) => {
    setItems((prev) => [
      ...prev,
      { id: String(Date.now()) + Math.random().toString(16).slice(2), ...item },
    ]);
    setTool("select");
  };

  const moveItem = (id: string, x: number, y: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  };

  return (
    <div className="h-screen w-screen bg-zinc-100 p-4">
      <div className="mx-auto flex h-full max-w-6xl flex-col gap-3">
        <Toolbar activeTool={tool} onChange={setTool} />

        <div className="flex-1 min-h-0">
          <Whiteboard
            tool={tool}
            items={items}
            onAdd={addItem}
            onMove={moveItem}
          />
        </div>
      </div>
    </div>
  );
}
