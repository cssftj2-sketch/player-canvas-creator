import React from 'react';
import { Rnd } from 'react-rnd';

interface DividerProps {
  id: string;
  orientation: 'horizontal' | 'vertical';
  color: 'gold' | 'emerald';
  position: { x: number; y: number };
  size: { width: number; height: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  customColor?: string;
}

const colorClasses = {
  gold: 'bg-primary',
  emerald: 'bg-secondary',
};

export const Divider: React.FC<DividerProps> = ({
  id,
  orientation,
  color,
  position,
  size,
  onPositionChange,
  onSizeChange,
  onSelect,
  isSelected,
  customColor,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <Rnd
      position={position}
      size={size}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, pos) => {
        onSizeChange(id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height) });
        onPositionChange(id, pos);
      }}
      bounds="parent"
      className={`cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
      minWidth={orientation === 'horizontal' ? 50 : 2}
      minHeight={orientation === 'vertical' ? 50 : 2}
    >
      <div
        className={`w-full h-full rounded-full ${colorClasses[color]}`}
        onClick={handleClick}
        style={{ backgroundColor: customColor || undefined }}
      />
    </Rnd>
  );
};
