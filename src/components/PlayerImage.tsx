import React from 'react';
import { Rnd } from 'react-rnd';
import { Upload, ImageOff } from 'lucide-react';

interface PlayerImageProps {
  id: string;
  imageUrl: string | null;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onImageUpload: (removeBackground: boolean) => void;
  isProcessing: boolean;
  progress: number;
  onSelect: (id: string) => void;
  isSelected: boolean;
  removeBackgroundEnabled?: boolean;
  onToggleRemoveBackground?: () => void;
}

export const PlayerImage: React.FC<PlayerImageProps> = ({
  id,
  imageUrl,
  position,
  size,
  onPositionChange,
  onSizeChange,
  onImageUpload,
  isProcessing,
  progress,
  onSelect,
  isSelected,
  removeBackgroundEnabled = true,
  onToggleRemoveBackground,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload(removeBackgroundEnabled);
  };

  return (
    <Rnd
      position={position}
      size={size}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, pos) => {
        onSizeChange(id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        onPositionChange(id, pos);
      }}
      bounds="parent"
      className={`cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
      minWidth={100}
      minHeight={100}
    >
      <div
        className="w-full h-full flex items-center justify-center relative group"
        onClick={handleClick}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Player"
              className="w-full h-full object-contain drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.3))',
              }}
            />
            <button
              onClick={handleUploadClick}
              className="absolute bottom-2 right-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
            >
              <Upload className="w-4 h-4 text-foreground" />
            </button>
          </>
        ) : (
          <div
            className="w-full h-full border-2 border-dashed border-muted rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-card/30"
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-heading text-primary">
                    {progress}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Removing background...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 p-4">
                <Upload className="w-10 h-10 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground font-heading text-center">
                  Click to upload player image
                </span>
                
                {/* Background Removal Toggle */}
                <label 
                  className="flex items-center gap-2 mt-2 cursor-pointer bg-muted/50 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={removeBackgroundEnabled}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleRemoveBackground?.();
                    }}
                    className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <ImageOff className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Remove background</span>
                </label>

                <button
                  onClick={handleUploadClick}
                  className="mt-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors border border-primary/30"
                >
                  Choose Image
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Rnd>
  );
};