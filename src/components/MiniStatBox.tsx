import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface MiniStatBoxProps {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onValueChange: (id: string, value: string, label: string) => void;
}

export const MiniStatBox: React.FC<MiniStatBoxProps> = ({
  id,
  value,
  label,
  sublabel,
  position,
  onPositionChange,
  onValueChange,
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

  return (
    <Rnd
      position={position}
      size={{ width: 100, height: 80 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      className="cursor-move"
    >
      <div
        className="w-full h-full flex flex-col items-center justify-center hover:ring-2 ring-gold/30 rounded-lg transition-all bg-card/40 backdrop-blur-sm border border-border/50 p-2"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="w-16 text-center bg-transparent text-2xl font-display text-gold outline-none border-b border-current"
            />
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleBlur}
              className="w-20 text-center bg-transparent text-[10px] text-foreground/70 outline-none border-b border-current uppercase"
            />
          </div>
        ) : (
          <>
            <span className="text-2xl font-display text-gold">{value}</span>
            <span className="text-[10px] text-foreground/70 uppercase font-heading tracking-wider">
              {label}
            </span>
            {sublabel && (
              <span className="text-[8px] text-muted-foreground uppercase">
                {sublabel}
              </span>
            )}
          </>
        )}
      </div>
    </Rnd>
  );
};
