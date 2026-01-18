import React from 'react';
import { Rnd } from 'react-rnd';

export type ShapeType = 
  | 'accent-line' 
  | 'corner-bracket' 
  | 'glow-circle' 
  | 'diagonal-stripe' 
  | 'hex-pattern'
  | 'gradient-overlay'
  | 'spotlight';

interface DecorativeShapeProps {
  id: string;
  type: ShapeType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  color?: string;
  zIndex?: number;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const DecorativeShape: React.FC<DecorativeShapeProps> = ({
  id,
  type,
  position,
  size,
  rotation = 0,
  opacity = 1,
  color = 'var(--theme-primary)',
  zIndex = 1,
  onPositionChange,
  onSizeChange,
  onSelect,
  isSelected,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  const renderShape = () => {
    switch (type) {
      case 'accent-line':
        return (
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              opacity,
            }}
          />
        );
      
      case 'corner-bracket':
        return (
          <div className="w-full h-full relative">
            <div 
              className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2"
              style={{ borderColor: color, opacity }}
            />
            <div 
              className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2"
              style={{ borderColor: color, opacity }}
            />
            <div 
              className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2"
              style={{ borderColor: color, opacity }}
            />
            <div 
              className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2"
              style={{ borderColor: color, opacity }}
            />
          </div>
        );
      
      case 'glow-circle':
        return (
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
              opacity,
              filter: 'blur(20px)',
            }}
          />
        );
      
      case 'diagonal-stripe':
        return (
          <div 
            className="w-full h-full overflow-hidden"
            style={{ opacity }}
          >
            <div 
              className="w-[200%] h-full origin-center"
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  ${color}20 10px,
                  ${color}20 20px
                )`,
                transform: `rotate(${rotation}deg)`,
              }}
            />
          </div>
        );
      
      case 'hex-pattern':
        return (
          <svg 
            className="w-full h-full" 
            viewBox="0 0 100 100"
            style={{ opacity }}
          >
            <defs>
              <pattern id={`hex-${id}`} width="30" height="52" patternUnits="userSpaceOnUse">
                <polygon 
                  points="15,0 30,13 30,39 15,52 0,39 0,13" 
                  fill="none" 
                  stroke={color} 
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#hex-${id})`} />
          </svg>
        );
      
      case 'gradient-overlay':
        return (
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(${rotation}deg, ${color}30, transparent)`,
              opacity,
            }}
          />
        );
      
      case 'spotlight':
        return (
          <div 
            className="w-full h-full"
            style={{
              background: `conic-gradient(from ${rotation}deg, transparent, ${color}20, transparent 60%)`,
              opacity,
              borderRadius: '50%',
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Rnd
      position={position}
      size={size}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, pos) => {
        onSizeChange(id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height) });
        onPositionChange(id, pos);
      }}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900' : ''}`}
    >
      <div 
        className="w-full h-full transition-all"
        onClick={handleClick}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {renderShape()}
      </div>
    </Rnd>
  );
};
