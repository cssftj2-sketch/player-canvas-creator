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
      size={{ width: 120, height: 110 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-lg' : ''}`}
    >
      <div
        className="w-full h-full relative hover:ring-2 ring-amber-500/30 rounded-xl transition-all overflow-hidden"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {/* Background with gradient */}
        <div 
          className="absolute inset-0 rounded-xl" 
          style={{ 
            background: `linear-gradient(145deg, ${bgColor}, color-mix(in srgb, ${bgColor} 70%, black))`,
            boxShadow: `0 8px 32px ${bgColor}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}
        />
        
        {/* Shine overlay */}
        <div 
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)',
          }}
        />
        
        {/* Diamond pattern accent */}
        <div 
          className="absolute top-0 right-0 w-16 h-16 opacity-10"
          style={{
            background: `repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.5) 4px, rgba(255,255,255,0.5) 8px)`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-3">
          {isEditing ? (
            <div className="flex flex-col items-center gap-1">
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-24 text-center bg-transparent text-xs font-heading uppercase outline-none border-b border-current"
                style={{ color: textColor || 'rgba(255,255,255,0.9)' }}
              />
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="w-16 text-center bg-transparent text-5xl font-display outline-none border-b border-current"
                style={{ color: numberColor || '#FFFFFF' }}
              />
            </div>
          ) : (
            <>
              <span 
                className="text-[10px] font-heading uppercase tracking-widest mb-1"
                style={{ color: textColor || 'rgba(255,255,255,0.85)' }}
              >
                {label}
              </span>
              <span 
                className="text-5xl font-display leading-none drop-shadow-lg"
                style={{ 
                  color: numberColor || '#FFFFFF',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                {value}
              </span>
              {/* Underline accent */}
              <div 
                className="w-8 h-0.5 mt-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.4)' }}
              />
            </>
          )}
        </div>
        
        {/* Bottom corner accent */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)' }}
        />
      </div>
    </Rnd>
  );
};