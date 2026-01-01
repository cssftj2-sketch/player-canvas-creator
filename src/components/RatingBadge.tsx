import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface RatingBadgeProps {
  id: string;
  value: string;
  label: string;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onValueChange: (id: string, value: string, label: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  id,
  value,
  label,
  position,
  onPositionChange,
  onValueChange,
  onSelect,
  isSelected,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [editLabel, setEditLabel] = useState(label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onValueChange(id, editValue, editLabel);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <Rnd
      position={position}
      size={{ width: 120, height: 100 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      className={`cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg' : ''}`}
    >
      <div
        className="w-full h-full relative hover:ring-2 ring-gold/30 rounded-lg transition-all"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {/* Gold gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-lg opacity-90" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-2">
          {isEditing ? (
            <div className="flex flex-col items-center gap-1">
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-24 text-center bg-transparent text-xs font-heading uppercase text-primary-foreground/80 outline-none border-b border-current"
              />
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="w-16 text-center bg-transparent text-4xl font-display text-primary-foreground outline-none border-b border-current"
              />
            </div>
          ) : (
            <>
              <span className="text-xs font-heading uppercase text-primary-foreground/80 tracking-wider">
                {label}
              </span>
              <span className="text-4xl font-display text-primary-foreground leading-none">
                {value}
              </span>
            </>
          )}
        </div>
      </div>
    </Rnd>
  );
};
