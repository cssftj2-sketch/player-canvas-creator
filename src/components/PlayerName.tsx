import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface PlayerNameProps {
  id: string;
  firstName: string;
  lastName: string;
  number: string;
  country: string;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onValueChange: (id: string, data: { firstName: string; lastName: string; number: string; country: string }) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  zIndex?: number;
}

export const PlayerName: React.FC<PlayerNameProps> = ({
  id,
  firstName,
  lastName,
  number,
  country,
  position,
  onPositionChange,
  onValueChange,
  onSelect,
  isSelected,
  zIndex = 15,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName, lastName, number, country });

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onValueChange(id, editData);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <Rnd
      position={position}
      size={{ width: 300, height: 180 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-lg' : ''}`}
    >
      <div
        className="flex flex-col items-start hover:ring-2 ring-amber-500/30 rounded-lg p-2 transition-all"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={editData.firstName}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
              onBlur={handleBlur}
              autoFocus
              className="bg-transparent text-4xl font-display text-white outline-none border-b border-white/30"
              placeholder="First Name"
            />
            <input
              type="text"
              value={editData.lastName}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
              className="bg-transparent text-6xl font-display outline-none border-b"
              style={{ color: 'var(--theme-primary)', borderColor: 'var(--theme-primary)' }}
              placeholder="Last Name"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editData.number}
                onChange={(e) => setEditData({ ...editData, number: e.target.value })}
                className="w-12 bg-transparent text-2xl font-display outline-none border-b"
                style={{ color: 'var(--theme-primary)', borderColor: 'var(--theme-primary)' }}
                placeholder="#"
              />
              <input
                type="text"
                value={editData.country}
                onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                onBlur={handleBlur}
                className="bg-transparent text-3xl font-display outline-none border-b"
                style={{ color: 'var(--theme-secondary)', borderColor: 'var(--theme-secondary)' }}
                placeholder="Country"
              />
            </div>
          </div>
        ) : (
          <>
            <span className="text-4xl font-display text-white tracking-wide">
              {firstName}
            </span>
            <span 
              className="text-6xl font-display tracking-wider leading-none"
              style={{ color: 'var(--theme-primary)' }}
            >
              {lastName}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="text-2xl font-display border-2 px-2 rounded"
                style={{ color: 'var(--theme-primary)', borderColor: 'var(--theme-primary)' }}
              >
                {number}
              </span>
              <span 
                className="text-3xl font-display tracking-widest"
                style={{ color: 'var(--theme-secondary)' }}
              >
                {country}
              </span>
            </div>
          </>
        )}
      </div>
    </Rnd>
  );
};