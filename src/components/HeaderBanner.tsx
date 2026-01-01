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
      size={{ width: 280, height: 60 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      className={`cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded' : ''}`}
    >
      <div
        className="relative hover:ring-2 ring-gold/30 rounded transition-all"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        <div className="bg-secondary py-1 px-4 inline-block skew-x-[-5deg]">
          {isEditing ? (
            <input
              type="text"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="bg-transparent text-xs font-heading uppercase text-secondary-foreground outline-none border-b border-current tracking-wider"
            />
          ) : (
            <span className="text-xs font-heading uppercase text-secondary-foreground tracking-wider">
              {subtitle}
            </span>
          )}
        </div>
        <div className="bg-primary py-2 px-4 -mt-1 skew-x-[-5deg]">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleBlur}
              className="bg-transparent text-xl font-display text-primary-foreground outline-none border-b border-current tracking-wide"
            />
          ) : (
            <span className="text-xl font-display text-primary-foreground tracking-wide">
              {title}
            </span>
          )}
        </div>
      </div>
    </Rnd>
  );
};
