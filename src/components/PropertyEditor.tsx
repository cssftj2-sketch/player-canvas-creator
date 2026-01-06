import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Trash2, Palette, Maximize, Type, X, ArrowUp, ArrowDown, Layers } from 'lucide-react';

export interface ComponentData {
  id: string;
  type: 'circle' | 'box' | 'miniStat' | 'rating' | 'header' | 'playerName' | 'chart' | 'playerImage' | 'progressBar' | 'divider' | 'icon' | 'text';
  value?: string;
  label?: string;
  sublabel?: string;
  color?: 'gold' | 'emerald';
  size?: 'lg' | 'md' | 'sm';
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  orientation?: 'horizontal' | 'vertical';
  customColor?: string;
  textColor?: string;
  numberColor?: string;
  zIndex?: number;
  canDelete?: boolean;
}

interface PropertyEditorProps {
  component: ComponentData | null;
  onUpdate: (data: Partial<ComponentData>) => void;
  onDelete: () => void;
  onClose: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdate,
  onDelete,
  onClose,
  onBringToFront,
  onSendToBack,
}) => {
  const { t } = useTheme();

  if (!component) return null;

  const colorOptions = [
    { id: 'gold', label: 'Primary', class: 'bg-amber-500' },
    { id: 'emerald', label: 'Secondary', class: 'bg-emerald-500' },
  ];

  const sizeOptions = [
    { id: 'sm', label: 'S' },
    { id: 'md', label: 'M' },
    { id: 'lg', label: 'L' },
  ];

  const customColors = [
    '#D4AF37', '#059669', '#3B82F6', '#DC2626', '#7C3AED', 
    '#F59E0B', '#10B981', '#EC4899', '#6366F1', '#14B8A6',
    '#F97316', '#06B6D4', '#84CC16', '#EF4444', '#8B5CF6',
    '#FFFFFF', '#94A3B8', '#64748B', '#1F2937', '#000000'
  ];

  const showTextColors = ['circle', 'box', 'miniStat', 'rating', 'text', 'chart'].includes(component.type);
  const canDelete = component.canDelete !== false;

  return (
    <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-heading text-neutral-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" />
          {t('properties.title')}
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Z-Index Controls */}
      <div>
        <label className="text-xs text-neutral-400 block mb-2 flex items-center gap-1">
          <Layers className="w-3 h-3" />
          Layer Order
        </label>
        <div className="flex gap-2">
          <button
            onClick={onBringToFront}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg transition-colors text-xs"
          >
            <ArrowUp className="w-3 h-3" />
            Bring Front
          </button>
          <button
            onClick={onSendToBack}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg transition-colors text-xs"
          >
            <ArrowDown className="w-3 h-3" />
            Send Back
          </button>
        </div>
      </div>

      {/* Value Editor */}
      {component.value !== undefined && (
        <div>
          <label className="text-xs text-neutral-400 block mb-2">Value</label>
          <input
            type="text"
            value={component.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      )}

      {/* Label Editor */}
      {component.label !== undefined && (
        <div>
          <label className="text-xs text-neutral-400 block mb-2">Label</label>
          <input
            type="text"
            value={component.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      )}

      {/* Color Selector */}
      {component.color !== undefined && (
        <div>
          <label className="text-xs text-neutral-400 block mb-2 flex items-center gap-1">
            <Palette className="w-3 h-3" />
            {t('properties.color')}
          </label>
          <div className="flex gap-2 mb-2">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => onUpdate({ color: color.id as 'gold' | 'emerald' })}
                className={`w-8 h-8 rounded-full ${color.class} border-2 transition-all ${
                  component.color === color.id ? 'border-white scale-110' : 'border-transparent'
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom Color Picker */}
      <div>
        <label className="text-xs text-neutral-400 block mb-2">Element Color</label>
        <div className="grid grid-cols-10 gap-1">
          {customColors.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ customColor: color })}
              className={`w-5 h-5 rounded border transition-all ${
                component.customColor === color ? 'border-white scale-110' : 'border-neutral-600'
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

      {/* Text/Number Color Pickers */}
      {showTextColors && (
        <>
          <div>
            <label className="text-xs text-neutral-400 block mb-2">Number/Value Color</label>
            <div className="grid grid-cols-10 gap-1">
              {customColors.map((color) => (
                <button
                  key={`num-${color}`}
                  onClick={() => onUpdate({ numberColor: color })}
                  className={`w-5 h-5 rounded border transition-all ${
                    component.numberColor === color ? 'border-white scale-110' : 'border-neutral-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={component.numberColor || '#FFFFFF'}
              onChange={(e) => onUpdate({ numberColor: e.target.value })}
              className="mt-2 w-full h-6 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-2">Text/Label Color</label>
            <div className="grid grid-cols-10 gap-1">
              {customColors.map((color) => (
                <button
                  key={`text-${color}`}
                  onClick={() => onUpdate({ textColor: color })}
                  className={`w-5 h-5 rounded border transition-all ${
                    component.textColor === color ? 'border-white scale-110' : 'border-neutral-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={component.textColor || '#94A3B8'}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="mt-2 w-full h-6 rounded cursor-pointer"
            />
          </div>
        </>
      )}

      {/* Size Selector */}
      {component.size !== undefined && (
        <div>
          <label className="text-xs text-neutral-400 block mb-2 flex items-center gap-1">
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
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                    : 'border-neutral-600 text-neutral-400 hover:border-neutral-500'
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
          <label className="text-xs text-neutral-400 block mb-2 flex items-center gap-1">
            <Type className="w-3 h-3" />
            Font Size
          </label>
          <input
            type="range"
            min="12"
            max="120"
            value={component.fontSize}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
            className="w-full accent-amber-500"
          />
          <span className="text-xs text-neutral-400">{component.fontSize}px</span>
        </div>
      )}

      {/* Delete Button */}
      {canDelete && (
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {t('properties.delete')}
        </button>
      )}
    </div>
  );
};