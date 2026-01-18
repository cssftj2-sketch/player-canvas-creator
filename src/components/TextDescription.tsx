import React, { useState, useRef, useEffect } from 'react';
import { Type } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface TextDescriptionProps {
  id: string;
  text: string;
  position: Position;
  size: Size;
  zIndex?: number;
  fontSize?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  customColor?: string;
  customBgColor?: string;
  onPositionChange: (id: string, position: Position) => void;
  onSizeChange: (id: string, size: Size) => void;
  onValueChange: (id: string, text: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const TextDescription: React.FC<TextDescriptionProps> = ({
  id,
  text,
  position,
  size,
  zIndex = 10,
  fontSize = 12,
  lineHeight = 1.6,
  textAlign = 'left',
  customColor,
  customBgColor,
  onPositionChange,
  onSizeChange,
  onValueChange,
  onSelect,
  isSelected,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    onSelect(id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: size.width,
      height: size.height,
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        onPositionChange(id, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.mouseX;
        const deltaY = e.clientY - resizeStart.mouseY;
        const newWidth = Math.max(150, resizeStart.width + deltaX);
        const newHeight = Math.max(60, resizeStart.height + deltaY);
        onSizeChange(id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, id, onPositionChange, onSizeChange]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(id, e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const textColor = customColor || 'rgb(212, 212, 212)';
  const bgColor = customBgColor || 'rgba(38, 38, 38, 0.8)';

  return (
    <div
      className="absolute group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
        cursor: isDragging ? 'grabbing' : isEditing ? 'text' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Selection Border */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-amber-400 pointer-events-none rounded" />
      )}

      {/* Content Box */}
      <div
        className="w-full h-full rounded border border-neutral-600 overflow-hidden"
        style={{
          backgroundColor: bgColor,
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-3 bg-transparent border-none outline-none resize-none font-body"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight,
              textAlign,
              color: textColor,
            }}
          />
        ) : (
          <div
            className="w-full h-full p-3 overflow-y-auto font-body"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight,
              textAlign,
              color: textColor,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {text || 'Double-click to edit...'}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {isSelected && !isEditing && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-amber-400 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
          style={{ borderRadius: '0 0 4px 0' }}
        />
      )}

      {/* Icon Indicator */}
      {!isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Type className="w-3 h-3 text-neutral-400" />
        </div>
      )}
    </div>
  );
};

export const TextDescription: React.FC<TextDescriptionProps> = ({
  id,
  text,
  position,
  size,
  zIndex = 10,
  fontSize = 12,
  lineHeight = 1.6,
  textAlign = 'left',
  customColor,
  customBgColor,
  onPositionChange,
  onSizeChange,
  onValueChange,
  onSelect,
  isSelected,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    onSelect(id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: size.width,
      height: size.height,
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        onPositionChange(id, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.mouseX;
        const deltaY = e.clientY - resizeStart.mouseY;
        const newWidth = Math.max(150, resizeStart.width + deltaX);
        const newHeight = Math.max(60, resizeStart.height + deltaY);
        onSizeChange(id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, id, onPositionChange, onSizeChange]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(id, e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const textColor = customColor || 'rgb(212, 212, 212)';
  const bgColor = customBgColor || 'rgba(38, 38, 38, 0.8)';

  return (
    <div
      className="absolute group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
        cursor: isDragging ? 'grabbing' : isEditing ? 'text' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Selection Border */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-amber-400 pointer-events-none rounded" />
      )}

      {/* Content Box */}
      <div
        className="w-full h-full rounded border border-neutral-600 overflow-hidden"
        style={{
          backgroundColor: bgColor,
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-3 bg-transparent border-none outline-none resize-none font-body"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight,
              textAlign,
              color: textColor,
            }}
          />
        ) : (
          <div
            className="w-full h-full p-3 overflow-y-auto font-body"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight,
              textAlign,
              color: textColor,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {text || 'Double-click to edit...'}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {isSelected && !isEditing && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-amber-400 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
          style={{ borderRadius: '0 0 4px 0' }}
        />
      )}

      {/* Icon Indicator */}
      {!isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Type className="w-3 h-3 text-neutral-400" />
        </div>
      )}
    </div>
  );
};
