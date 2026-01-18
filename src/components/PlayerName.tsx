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
      size={{ width: 320, height: 200 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-lg' : ''}`}
    >
      <div
        className="relative flex flex-col items-start hover:ring-2 ring-amber-500/30 rounded-lg p-3 transition-all"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {/* Decorative accent bar */}
        <div 
          className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
          style={{ 
            background: `linear-gradient(to bottom, var(--theme-primary), var(--theme-secondary))`,
            boxShadow: '0 0 10px var(--theme-primary)',
          }}
        />
        
        <div className="ml-3">
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
              {/* First name with subtle shadow */}
              <span 
                className="text-4xl font-display text-white tracking-wide drop-shadow-md"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                {firstName}
              </span>
              
              {/* Last name - prominent with glow */}
              <span 
                className="block text-6xl font-display tracking-wider leading-none drop-shadow-lg"
                style={{ 
                  color: 'var(--theme-primary)',
                  textShadow: `0 0 30px var(--theme-primary), 0 4px 15px rgba(0,0,0,0.5)`,
                }}
              >
                {lastName}
              </span>
              
              {/* Number and country row */}
              <div className="flex items-center gap-3 mt-2">
                {/* Number badge */}
                <div 
                  className="relative px-3 py-1 rounded-lg border-2 font-display text-2xl"
                  style={{ 
                    color: 'var(--theme-primary)', 
                    borderColor: 'var(--theme-primary)',
                    background: 'rgba(0,0,0,0.4)',
                    boxShadow: `0 0 15px var(--theme-primary)30`,
                  }}
                >
                  {number}
                  {/* Shine effect */}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-20"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3), transparent 50%)' }}
                  />
                </div>
                
                {/* Country with accent underline */}
                <div className="relative">
                  <span 
                    className="text-3xl font-display tracking-[0.3em] uppercase"
                    style={{ 
                      color: 'var(--theme-secondary)',
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }}
                  >
                    {country}
                  </span>
                  <div 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--theme-secondary)', opacity: 0.6 }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Rnd>
  );
};