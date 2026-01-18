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
  textColor?: string;
  numberColor?: string;
  zIndex?: number;
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

  const boxColor = customColor || 'var(--theme-primary)';
  
  return (
    <Rnd
      position={position}
      size={{ width: 140, height: 100 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-lg' : ''}`}
    >
      <div
        className="relative w-full h-full bg-gradient-to-br from-neutral-900/95 via-neutral-800/90 to-neutral-900/95 border-2 rounded-lg p-3 flex flex-col items-center justify-center hover:ring-2 ring-amber-500/30 transition-all overflow-hidden"
        style={{
          borderColor: `${boxColor}60`,
          boxShadow: `0 4px 20px ${boxColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {/* Corner accents */}
        <div 
          className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
          style={{ borderColor: boxColor }}
        />
        <div 
          className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2"
          style={{ borderColor: boxColor }}
        />
        <div 
          className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2"
          style={{ borderColor: boxColor }}
        />
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
          style={{ borderColor: boxColor }}
        />
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ background: `linear-gradient(135deg, ${boxColor}20, transparent 50%)` }}
        />
        {isEditing ? (
          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="w-16 text-center bg-transparent text-3xl font-display text-amber-500 outline-none border-b border-current"
            />
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleBlur}
              className="w-20 text-center bg-transparent text-xs font-heading uppercase text-emerald-500 outline-none border-b border-current"
            />
          </div>
        ) : (
          <>
            <span 
              className="text-3xl font-display"
              style={{ color: numberColor || customColor || 'var(--theme-primary)' }}
            >
              {value}
            </span>
            <span 
              className="text-xs font-heading uppercase tracking-wider"
              style={{ color: textColor || 'var(--theme-secondary)' }}
            >
              {label}
            </span>
            {subStats && (
              <div className="flex gap-3 mt-2 pt-2 border-t border-neutral-700">
                {subStats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <span className="text-xs text-neutral-300">{stat.value}</span>
                    <span className="text-[10px] block text-neutral-500">{stat.label}</span>
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