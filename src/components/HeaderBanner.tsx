import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface HeaderBannerProps {
  id: string;
  title: string;
  subtitle: string;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onValueChange: (id: string, title: string, subtitle: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  zIndex?: number;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  id,
  title,
  subtitle,
  position,
  onPositionChange,
  onValueChange,
  onSelect,
  isSelected,
  zIndex = 20,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onValueChange(id, editTitle, editSubtitle);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <Rnd
      position={position}
      size={{ width: 320, height: 80 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded' : ''}`}
    >
      <div
        className="relative hover:ring-2 ring-gold/30 rounded transition-all"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {/* Decorative line accent */}
        <div 
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12"
          style={{ background: 'var(--theme-primary)' }}
        />
        
        {/* Subtitle banner */}
        <div 
          className="relative py-1.5 px-5 inline-block skew-x-[-8deg] shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, var(--theme-secondary), color-mix(in srgb, var(--theme-secondary) 80%, black))`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          <div className="skew-x-[8deg]">
            {isEditing ? (
              <input
                type="text"
                value={editSubtitle}
                onChange={(e) => setEditSubtitle(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="bg-transparent text-xs font-heading uppercase text-white outline-none border-b border-current tracking-widest"
              />
            ) : (
              <span className="text-xs font-heading uppercase text-white tracking-widest drop-shadow-sm">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        
        {/* Title banner */}
        <div 
          className="relative py-3 px-6 -mt-1 skew-x-[-8deg] shadow-xl"
          style={{ 
            background: `linear-gradient(135deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 85%, black))`,
            boxShadow: '0 6px 25px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <div className="skew-x-[8deg]">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleBlur}
                className="bg-transparent text-2xl font-display text-white outline-none border-b border-current tracking-wide"
              />
            ) : (
              <span className="text-2xl font-display text-white tracking-wide drop-shadow-md">
                {title}
              </span>
            )}
          </div>
          {/* Shine effect */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent 50%)' }}
          />
        </div>
        
        {/* Bottom accent dot */}
        <div 
          className="absolute -bottom-1 right-4 w-2 h-2 rounded-full"
          style={{ background: 'var(--theme-secondary)' }}
        />
      </div>
    </Rnd>
  );
};
