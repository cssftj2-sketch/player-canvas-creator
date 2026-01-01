import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface StatBoxProps {
  id: string;
  value: string;
  label: string;
  subStats?: { label: string; value: string }[];
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onValueChange: (id: string, value: string, label: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  customColor?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({
  id,
  value,
  label,
  subStats,
  position,
  onPositionChange,
  onValueChange,
  onSelect,
  isSelected,
  customColor,
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
      size={{ width: 140, height: 100 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      className={`cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg' : ''}`}
    >
      <div
        className="w-full h-full bg-card border-2 border-border rounded-lg p-3 flex flex-col items-center justify-center hover:ring-2 ring-gold/30 transition-all"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {isEditing ? (
          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="w-16 text-center bg-transparent text-3xl font-display text-gold outline-none border-b border-current"
            />
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleBlur}
              className="w-20 text-center bg-transparent text-xs font-heading uppercase text-emerald outline-none border-b border-current"
            />
          </div>
        ) : (
          <>
            <span 
              className="text-3xl font-display text-primary"
              style={{ color: customColor || undefined }}
            >
              {value}
            </span>
            <span className="text-xs font-heading uppercase tracking-wider text-secondary">
              {label}
            </span>
            {subStats && (
              <div className="flex gap-3 mt-2 pt-2 border-t border-border">
                {subStats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <span className="text-xs text-foreground/80">{stat.value}</span>
                    <span className="text-[10px] block text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Rnd>
  );
};
