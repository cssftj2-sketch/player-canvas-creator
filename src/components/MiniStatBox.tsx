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
  onSelect: (id: string) => void;
  isSelected: boolean;
  customColor?: string;
  textColor?: string;
  numberColor?: string;
  zIndex?: number;
}

export const MiniStatBox: React.FC<MiniStatBoxProps> = ({
  id,
  value,
  label,
  sublabel,
  position,
  onPositionChange,
  onValueChange,
  onSelect,
  isSelected,
  customColor,
  textColor,
  numberColor,
  zIndex = 10,
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
      size={{ width: 100, height: 80 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-lg' : ''}`}
    >
      <div
        className="w-full h-full flex flex-col items-center justify-center hover:ring-2 ring-amber-500/30 rounded-lg transition-all bg-neutral-900/40 backdrop-blur-sm border border-neutral-700/50 p-2"
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
              className="w-16 text-center bg-transparent text-2xl font-display text-amber-500 outline-none border-b border-current"
            />
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleBlur}
              className="w-20 text-center bg-transparent text-[10px] text-neutral-400 outline-none border-b border-current uppercase"
            />
          </div>
        ) : (
          <>
            <span 
              className="text-2xl font-display"
              style={{ color: numberColor || customColor || 'var(--theme-primary)' }}
            >
              {value}
            </span>
            <span 
              className="text-[10px] uppercase font-heading tracking-wider"
              style={{ color: textColor || 'rgba(255,255,255,0.7)' }}
            >
              {label}
            </span>
            {sublabel && (
              <span className="text-[8px] text-neutral-500 uppercase">
                {sublabel}
              </span>
            )}
          </>
        )}
      </div>
    </Rnd>
  );
};