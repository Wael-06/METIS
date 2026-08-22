import type { DragEvent } from "react";

type Props = {
  label: string;
  onDragStart: (event: DragEvent<HTMLButtonElement>) => void;
};

export function GripHandle({ label, onDragStart }: Props) {
  return (
    <button
      type="button"
      className="drag-handle"
      draggable
      title="Drag to rearrange"
      aria-label={label}
      onDragStart={onDragStart}
    >
      <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true">
        <circle cx="3" cy="3" r="1.35" fill="currentColor" />
        <circle cx="7" cy="3" r="1.35" fill="currentColor" />
        <circle cx="3" cy="8" r="1.35" fill="currentColor" />
        <circle cx="7" cy="8" r="1.35" fill="currentColor" />
        <circle cx="3" cy="13" r="1.35" fill="currentColor" />
        <circle cx="7" cy="13" r="1.35" fill="currentColor" />
      </svg>
    </button>
  );
}
