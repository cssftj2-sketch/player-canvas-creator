import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface TextLabelProps {
  id: string;
  text: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  color: 'gold' | 'emerald';
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onValueChange: (id: string, text: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  customColor?: string;
}

const colorClasses = {
  gold: 'text-primary',
  emerald: 'text-secondary',
};

export const TextLabel: React.FC<TextLabelProps> = ({
  id,
  text,
  fontSize,
  fontWeight,
  color,
  position,
  onPositionChange,
  onValueChange,
  onSelect,
  isSelected,
  customColor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onValueChange(id, editText);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <Rnd
      position={position}
      size={{ width: 'auto', height: 'auto' }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      className={`cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded' : ''}`}
    >
      <div
        className={`font-heading ${colorClasses[color]} whitespace-nowrap px-1`}
        style={{ 
          fontSize: `${fontSize}px`,
          fontWeight,
          color: customColor || undefined,
        }}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-transparent outline-none border-b-2 border-current min-w-[50px]"
            style={{ fontSize: `${fontSize}px`, fontWeight }}
          />
        ) : (
          text
        )}
      </div>
    </Rnd>
  );
};
