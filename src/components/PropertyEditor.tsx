import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Trash2, Palette, Maximize, Type, X } from 'lucide-react';

export interface ComponentData {
  id: string;
  type: 'circle' | 'box' | 'miniStat' | 'rating' | 'header' | 'playerName' | 'chart' | 'playerImage' | 'progressBar' | 'divider' | 'icon';
  value?: string;
  label?: string;
  sublabel?: string;
  color?: 'gold' | 'emerald';
  size?: 'lg' | 'md' | 'sm';
  fontSize?: number;
  customColor?: string;
}

interface PropertyEditorProps {
  component: ComponentData | null;
  onUpdate: (data: Partial<ComponentData>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const { t } = useTheme();

  if (!component) return null;

  const colorOptions = [
    { id: 'gold', label: 'Primary', class: 'bg-primary' },
    { id: 'emerald', label: 'Secondary', class: 'bg-secondary' },
  ];

  const sizeOptions = [
    { id: 'sm', label: 'S' },
    { id: 'md', label: 'M' },
    { id: 'lg', label: 'L' },
  ];

  const customColors = [
    '#D4AF37', '#059669', '#3B82F6', '#DC2626', '#7C3AED', 
    '#F59E0B', '#10B981', '#EC4899', '#6366F1', '#14B8A6',
    '#FFFFFF', '#94A3B8', '#1F2937', '#000000'
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-heading text-foreground flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          {t('properties.title')}
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Value Editor */}
      {component.value !== undefined && (
        <div>
          <label className="text-xs text-muted-foreground block mb-2">Value</label>
          <input
            type="text"
            value={component.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}

      {/* Label Editor */}
      {component.label !== undefined && (
        <div>
          <label className="text-xs text-muted-foreground block mb-2">Label</label>
          <input
            type="text"
            value={component.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}

      {/* Color Selector */}
      {component.color !== undefined && (
        <div>
          <label className="text-xs text-muted-foreground block mb-2 flex items-center gap-1">
            <Palette className="w-3 h-3" />
            {t('properties.color')}
          </label>
          <div className="flex gap-2 mb-2">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => onUpdate({ color: color.id as 'gold' | 'emerald' })}
                className={`w-8 h-8 rounded-full ${color.class} border-2 transition-all ${
                  component.color === color.id ? 'border-foreground scale-110' : 'border-transparent'
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom Color Picker */}
      <div>
        <label className="text-xs text-muted-foreground block mb-2">Custom Color</label>
        <div className="grid grid-cols-7 gap-1">
          {customColors.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ customColor: color })}
              className={`w-6 h-6 rounded border transition-all ${
                component.customColor === color ? 'border-foreground scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <input
          type="color"
          value={component.customColor || '#D4AF37'}
          onChange={(e) => onUpdate({ customColor: e.target.value })}
          className="mt-2 w-full h-8 rounded cursor-pointer"
        />
      </div>

      {/* Size Selector */}
      {component.size !== undefined && (
        <div>
          <label className="text-xs text-muted-foreground block mb-2 flex items-center gap-1">
            <Maximize className="w-3 h-3" />
            {t('properties.size')}
          </label>
          <div className="flex gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size.id}
                onClick={() => onUpdate({ size: size.id as 'lg' | 'md' | 'sm' })}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-heading transition-all ${
                  component.size === size.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-muted-foreground'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Font Size */}
      {component.fontSize !== undefined && (
        <div>
          <label className="text-xs text-muted-foreground block mb-2 flex items-center gap-1">
            <Type className="w-3 h-3" />
            Font Size
          </label>
          <input
            type="range"
            min="12"
            max="120"
            value={component.fontSize}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
          <span className="text-xs text-muted-foreground">{component.fontSize}px</span>
        </div>
      )}

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        {t('properties.delete')}
      </button>
    </div>
  );
};
