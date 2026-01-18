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

  const accentColor = customColor || 'var(--theme-primary)';
  
  return (
    <Rnd
      position={position}
      size={{ width: 100, height: 85 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-lg' : ''}`}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center hover:ring-2 ring-amber-500/30 rounded-lg transition-all bg-gradient-to-br from-neutral-900/90 via-neutral-800/80 to-neutral-900/90 backdrop-blur-sm border border-neutral-700/50 p-2 overflow-hidden"
        style={{
          boxShadow: `0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {/* Top accent line */}
        <div 
          className="absolute top-0 left-2 right-2 h-0.5 rounded-full"
          style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
        />
        
        {isEditing ? (
          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="w-16 text-center bg-transparent text-2xl font-display outline-none border-b"
              style={{ color: accentColor, borderColor: accentColor }}
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
              className="text-3xl font-display leading-none drop-shadow-sm"
              style={{ 
                color: numberColor || accentColor,
                textShadow: `0 0 20px ${accentColor}30`,
              }}
            >
              {value}
            </span>
            <span 
              className="text-[10px] uppercase font-heading tracking-widest mt-1"
              style={{ color: textColor || 'rgba(255,255,255,0.8)' }}
            >
              {label}
            </span>
            {sublabel && (
              <span className="text-[8px] text-neutral-400 uppercase tracking-wide">
                {sublabel}
              </span>
            )}
          </>
        )}
        
        {/* Bottom corner accent */}
        <div 
          className="absolute bottom-1 right-1 w-2 h-2 rounded-sm opacity-40"
          style={{ background: accentColor }}
        />
      </div>
    </Rnd>
  );
};