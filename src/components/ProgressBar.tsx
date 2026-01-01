import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface ProgressBarProps {
  id: string;
  value: number;
  label: string;
  color: 'gold' | 'emerald';
  position: { x: number; y: number };
  size: { width: number; height: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onValueChange: (id: string, value: number, label: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  customColor?: string;
}

const colorClasses = {
  gold: 'bg-primary',
  emerald: 'bg-secondary',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  id,
  value,
  label,
  color,
  position,
  size,
  onPositionChange,
  onSizeChange,
  onValueChange,
  onSelect,
  isSelected,
  customColor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [editLabel, setEditLabel] = useState(label);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onValueChange(id, parseInt(editValue) || 0, editLabel);
  };

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
      minWidth={100}
      minHeight={40}
    >
      <div
        className="w-full h-full flex flex-col justify-center gap-1 p-2"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        <div className="flex justify-between items-center">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="flex-1 bg-transparent text-xs text-foreground/80 outline-none border-b border-current"
              />
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                className="w-12 bg-transparent text-xs text-foreground font-bold text-right outline-none border-b border-current"
              />
            </>
          ) : (
            <>
              <span className="text-xs text-foreground/80 uppercase tracking-wider">{label}</span>
              <span className="text-xs text-foreground font-bold">{value}%</span>
            </>
          )}
        </div>
        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
            style={{ 
              width: `${Math.min(100, Math.max(0, value))}%`,
              backgroundColor: customColor || undefined,
            }}
          />
        </div>
      </div>
    </Rnd>
  );
};
