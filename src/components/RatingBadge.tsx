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
  customColor?: string;
  textColor?: string;
  numberColor?: string;
  zIndex?: number;
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

  const bgColor = customColor || 'var(--theme-primary)';

  return (
    <Rnd
      position={position}
      size={{ width: 120, height: 100 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-lg' : ''}`}
    >
      <div
        className="w-full h-full relative hover:ring-2 ring-amber-500/30 rounded-lg transition-all"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {/* Background */}
        <div 
          className="absolute inset-0 rounded-lg opacity-90" 
          style={{ 
            background: `linear-gradient(to bottom right, ${bgColor}, ${bgColor}cc)` 
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-2">
          {isEditing ? (
            <div className="flex flex-col items-center gap-1">
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-24 text-center bg-transparent text-xs font-heading uppercase outline-none border-b border-current"
                style={{ color: textColor || 'rgba(255,255,255,0.8)' }}
              />
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="w-16 text-center bg-transparent text-4xl font-display outline-none border-b border-current"
                style={{ color: numberColor || '#FFFFFF' }}
              />
            </div>
          ) : (
            <>
              <span 
                className="text-xs font-heading uppercase tracking-wider"
                style={{ color: textColor || 'rgba(255,255,255,0.8)' }}
              >
                {label}
              </span>
              <span 
                className="text-4xl font-display leading-none"
                style={{ color: numberColor || '#FFFFFF' }}
              >
                {value}
              </span>
            </>
          )}
        </div>
      </div>
    </Rnd>
  );
};