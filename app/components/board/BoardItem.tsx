import { useEffect, useMemo, useRef } from "react";
import { Group, Image as KonvaImage, Text, Rect } from "react-konva";
import { useImage } from "react-konva-utils";
import { BoardItemModel } from "../../types/board";
import { ICON_REGISTRY } from "../../assets/board/iconRegistry";

type Props = {
  item: BoardItemModel;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
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

  const cfg = ICON_REGISTRY[item.type];
  const [img] = useImage(cfg.src, "anonymous");

  const handleSelect = (e: any) => {
    e.cancelBubble = true;
    onSelect(item.id);
  };

  const handleOpen = (e: any) => {
    e.cancelBubble = true;
    onOpen(item.id);
  };

  const handleDragMove = (e: any) => {
    const nx = e.target.x();
    const ny = e.target.y();
    const ok = onMove(item.id, nx, ny);
    if (!ok) e.target.position(lastGood.current);
    else lastGood.current = { x: nx, y: ny };
  };

  return (
    <Group
      x={item.x}
      y={item.y}
      draggable={draggable}
      onMouseDown={handleSelect}
      onTouchStart={handleSelect}
      onDblClick={handleOpen}
      onDblTap={handleOpen}
      onDragMove={handleDragMove}
    >
      <KonvaImage
        image={img ?? undefined}
        x={-cfg.w / 2}
        y={-cfg.h / 2}
        width={cfg.w}
        height={cfg.h}
      />

      {!!item.label && (
        <Text
          text={item.label}
          x={-cfg.w / 2}
          y={-8}
          width={cfg.w}
          align="center"
          fontSize={14}
          fontStyle="bold"
          fill={selected ? "#111" : "#2b2b2b"}
          listening={false}
        />
      )}
    </Group>
  );
}
