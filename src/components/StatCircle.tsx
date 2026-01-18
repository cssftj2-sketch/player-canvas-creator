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
  onSelect: (id: string) => void;
  isSelected: boolean;
  customColor?: string;
  textColor?: string;
  numberColor?: string;
  zIndex?: number;
}

const sizeClasses = {
  lg: { container: 'w-40 h-40', text: 'text-5xl', label: 'text-sm' },
  md: { container: 'w-32 h-32', text: 'text-4xl', label: 'text-xs' },
  sm: { container: 'w-24 h-24', text: 'text-3xl', label: 'text-[10px]' },
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

  // Get theme color based on color prop
  const themeColor = color === 'gold' ? 'var(--theme-primary)' : 'var(--theme-secondary)';

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

  const percentage = parseInt(value) || 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const activeColor = customColor || themeColor;

  return (
    <Rnd
      position={position}
      size={{ width: sizePixels[size], height: sizePixels[size] }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-full' : ''}`}
    >
      <div
        onClick={handleClick}
        className={`relative ${sizeClasses[size].container} flex flex-col items-center justify-center rounded-full border-4 bg-gradient-to-br from-neutral-900/95 via-neutral-800/90 to-neutral-900/95 backdrop-blur-sm transition-all hover:ring-4 hover:ring-white/20`}
        style={{ 
          borderColor: activeColor,
          boxShadow: `0 0 30px ${activeColor}25, inset 0 2px 10px rgba(255,255,255,0.05)`,
        }}
        onDoubleClick={handleDoubleClick}
      >
        {/* Outer glow ring */}
        <div 
          className="absolute inset-[-4px] rounded-full opacity-40 blur-sm"
          style={{ background: `conic-gradient(from 0deg, transparent, ${activeColor}, transparent 60%)` }}
        />
        
        {/* Progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          {/* Background track with gradient */}
          <defs>
            <linearGradient id={`track-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
            <linearGradient id={`progress-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={activeColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor={activeColor} stopOpacity="1" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0.6" />
            </linearGradient>
            <filter id={`glow-${id}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#track-${id})`}
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            filter={`url(#glow-${id})`}
            style={{ 
              stroke: `url(#progress-${id})`,
              transition: 'stroke-dashoffset 0.5s ease' 
            }}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
          {/* Highlight dot at end */}
          {percentage > 5 && (
            <circle
              cx="50"
              cy="5"
              r="2"
              fill={activeColor}
              style={{
                transform: `rotate(${(percentage / 100) * 360}deg)`,
                transformOrigin: '50px 50px',
                filter: 'blur(0.5px)',
              }}
            />
          )}
        </svg>

        {isEditing ? (
          <div className="flex flex-col items-center gap-1 z-10">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className={`w-16 text-center bg-transparent ${sizeClasses[size].text} font-display outline-none border-b border-current`}
              style={{ color: activeColor }}
            />
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleBlur}
              className={`w-20 text-center bg-transparent ${sizeClasses[size].label} text-neutral-300 outline-none border-b border-current`}
            />
          </div>
        ) : (
          <>
            <span 
              className={`font-display ${sizeClasses[size].text} z-10`}
              style={{ color: numberColor || activeColor }}
            >
              {value}
            </span>
            <span 
              className={`${sizeClasses[size].label} text-center leading-tight z-10 px-2`}
              style={{ color: textColor || 'rgba(255,255,255,0.8)' }}
            >
              {label}
            </span>
          </>
        )}
      </div>
    </Rnd>
  );
};