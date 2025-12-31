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

  return (
    <Rnd
      position={position}
      size={{ width: 300, height: 180 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      className="cursor-move"
    >
      <div
        className="flex flex-col items-start hover:ring-2 ring-gold/30 rounded-lg p-2 transition-all"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={editData.firstName}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
              onBlur={handleBlur}
              autoFocus
              className="bg-transparent text-4xl font-display text-foreground outline-none border-b border-foreground/30"
              placeholder="First Name"
            />
            <input
              type="text"
              value={editData.lastName}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
              className="bg-transparent text-6xl font-display text-gold outline-none border-b border-gold/30"
              placeholder="Last Name"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editData.number}
                onChange={(e) => setEditData({ ...editData, number: e.target.value })}
                className="w-12 bg-transparent text-2xl font-display text-gold outline-none border-b border-gold/30"
                placeholder="#"
              />
              <input
                type="text"
                value={editData.country}
                onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                onBlur={handleBlur}
                className="bg-transparent text-3xl font-display text-emerald outline-none border-b border-emerald/30"
                placeholder="Country"
              />
            </div>
          </div>
        ) : (
          <>
            <span className="text-4xl font-display text-foreground tracking-wide">
              {firstName}
            </span>
            <span className="text-6xl font-display text-gold tracking-wider leading-none">
              {lastName}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-display text-gold border-2 border-gold px-2 rounded">
                {number}
              </span>
              <span className="text-3xl font-display text-emerald tracking-widest">
                {country}
              </span>
            </div>
          </>
        )}
      </div>
    </Rnd>
  );
};
