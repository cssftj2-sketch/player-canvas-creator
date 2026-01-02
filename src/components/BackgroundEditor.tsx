import React from 'react';
import { useTheme, CanvasBackground } from '@/contexts/ThemeContext';
import { Paintbrush } from 'lucide-react';

const presetBackgrounds: { name: string; bg: CanvasBackground }[] = [
  { name: 'Dark Gradient', bg: { type: 'gradient', color1: '#141414', color2: '#0a0a0a', angle: 180 } },
  { name: 'Midnight Blue', bg: { type: 'gradient', color1: '#1e3a5f', color2: '#0a1929', angle: 135 } },
  { name: 'Royal Purple', bg: { type: 'gradient', color1: '#2d1b4e', color2: '#0f0a1a', angle: 135 } },
  { name: 'Forest Green', bg: { type: 'gradient', color1: '#1a3a2f', color2: '#0a1510', angle: 135 } },
  { name: 'Crimson Night', bg: { type: 'gradient', color1: '#3d1a1a', color2: '#1a0a0a', angle: 135 } },
  { name: 'Gold Sunset', bg: { type: 'radial', color1: '#2a2010', color2: '#0a0905', angle: 0 } },
  { name: 'Pure Black', bg: { type: 'solid', color1: '#000000', color2: '#000000', angle: 0 } },
  { name: 'Charcoal', bg: { type: 'solid', color1: '#1f1f1f', color2: '#1f1f1f', angle: 0 } },
];

export const BackgroundEditor: React.FC = () => {
  const { t, canvasBackground, setCanvasBackground } = useTheme();

  return (
    <div className="bg-card border border-border rounded-lg p-3 space-y-2.5">
      <h3 className="text-xs font-medium text-foreground flex items-center gap-1.5">
        <Paintbrush className="w-3.5 h-3.5 text-primary" />
        {t('background.title')}
      </h3>

      {/* Type Selector */}
      <div className="flex gap-1">
        {(['solid', 'gradient', 'radial'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setCanvasBackground({ ...canvasBackground, type })}
            className={`px-2 py-1 rounded-md border text-[10px] font-medium transition-all ${
              canvasBackground.type === type
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            {t(`background.${type}`)}
          </button>
        ))}
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-0.5">Color 1</label>
          <input
            type="color"
            value={canvasBackground.color1}
            onChange={(e) => setCanvasBackground({ ...canvasBackground, color1: e.target.value })}
            className="w-full h-6 rounded cursor-pointer border border-border"
          />
        </div>
        {canvasBackground.type !== 'solid' && (
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">Color 2</label>
            <input
              type="color"
              value={canvasBackground.color2}
              onChange={(e) => setCanvasBackground({ ...canvasBackground, color2: e.target.value })}
              className="w-full h-6 rounded cursor-pointer border border-border"
            />
          </div>
        )}
      </div>

      {/* Angle Slider */}
      {canvasBackground.type === 'gradient' && (
        <div>
          <label className="text-[10px] text-muted-foreground block mb-0.5">Angle: {canvasBackground.angle}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={canvasBackground.angle}
            onChange={(e) => setCanvasBackground({ ...canvasBackground, angle: parseInt(e.target.value) })}
            className="w-full accent-primary h-1.5"
          />
        </div>
      )}

      {/* Presets */}
      <div>
        <label className="text-[10px] text-muted-foreground block mb-1">Presets</label>
        <div className="grid grid-cols-4 gap-1">
          {presetBackgrounds.map((preset, i) => (
            <button
              key={i}
              onClick={() => setCanvasBackground(preset.bg)}
              className="w-full aspect-square rounded-md border border-border hover:border-primary transition-all overflow-hidden"
              title={preset.name}
              style={{
                background: preset.bg.type === 'solid' 
                  ? preset.bg.color1
                  : preset.bg.type === 'gradient'
                  ? `linear-gradient(${preset.bg.angle}deg, ${preset.bg.color1}, ${preset.bg.color2})`
                  : `radial-gradient(circle, ${preset.bg.color1}, ${preset.bg.color2})`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};