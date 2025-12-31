import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface StatCircleProps {
  id: string;
  value: string;
  label: string;
  color: 'gold' | 'emerald';
  size: 'lg' | 'md' | 'sm';
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onValueChange: (id: string, value: string, label: string) => void;
}

const sizeClasses = {
  lg: { container: 'w-40 h-40', text: 'text-5xl', label: 'text-sm' },
  md: { container: 'w-32 h-32', text: 'text-4xl', label: 'text-xs' },
  sm: { container: 'w-24 h-24', text: 'text-3xl', label: 'text-[10px]' },
};

const colorClasses = {
  gold: {
    border: 'border-gold',
    text: 'text-gold',
    glow: 'shadow-gold',
    ring: 'ring-gold/30',
  },
  emerald: {
    border: 'border-emerald',
    text: 'text-emerald',
    glow: 'shadow-emerald',
    ring: 'ring-emerald/30',
  },
};

const sizePixels = {
  lg: 160,
  md: 128,
  sm: 96,
};

export const StatCircle: React.FC<StatCircleProps> = ({
  id,
  value,
  label,
  color,
  size,
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

  const percentage = parseInt(value) || 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Rnd
      position={position}
      size={{ width: sizePixels[size], height: sizePixels[size] }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      className="cursor-move"
    >
      <div
        className={`relative ${sizeClasses[size].container} flex flex-col items-center justify-center rounded-full border-4 ${colorClasses[color].border} ${colorClasses[color].glow} bg-card/80 backdrop-blur-sm transition-all hover:ring-4 ${colorClasses[color].ring}`}
        onDoubleClick={handleDoubleClick}
      >
        {/* Progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/30"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={colorClasses[color].text}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>

        {isEditing ? (
          <div className="flex flex-col items-center gap-1 z-10">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className={`w-16 text-center bg-transparent ${sizeClasses[size].text} font-display ${colorClasses[color].text} outline-none border-b border-current`}
            />
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleBlur}
              className={`w-20 text-center bg-transparent ${sizeClasses[size].label} text-foreground/80 outline-none border-b border-current`}
            />
          </div>
        ) : (
          <>
            <span className={`font-display ${sizeClasses[size].text} ${colorClasses[color].text} z-10`}>
              {value}
            </span>
            <span className={`${sizeClasses[size].label} text-foreground/80 text-center leading-tight z-10 px-2`}>
              {label}
            </span>
          </>
        )}
      </div>
    </Rnd>
  );
};
