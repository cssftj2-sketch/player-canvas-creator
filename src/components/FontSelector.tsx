import React from 'react';
import { useTheme, FontCombination } from '@/contexts/ThemeContext';
import { Type } from 'lucide-react';

const fontOptions: { id: FontCombination; name: string; preview: string }[] = [
  { id: 'modern', name: 'Modern', preview: 'Aa' },
  { id: 'classic', name: 'Classic', preview: 'Aa' },
  { id: 'bold', name: 'Bold', preview: 'Aa' },
  { id: 'elegant', name: 'Elegant', preview: 'Aa' },
  { id: 'tech', name: 'Tech', preview: 'Aa' },
  { id: 'sport', name: 'Sport', preview: 'Aa' },
  { id: 'minimal', name: 'Minimal', preview: 'Aa' },
  { id: 'retro', name: 'Retro', preview: 'Aa' },
  { id: 'luxury', name: 'Luxury', preview: 'Aa' },
  { id: 'dynamic', name: 'Dynamic', preview: 'Aa' },
];

const fontFamilyMap: Record<FontCombination, string> = {
  modern: "'Bebas Neue', sans-serif",
  classic: "'Playfair Display', serif",
  bold: "'Anton', sans-serif",
  elegant: "'Cormorant Garamond', serif",
  tech: "'Orbitron', sans-serif",
  sport: "'Teko', sans-serif",
  minimal: "'Poppins', sans-serif",
  retro: "'Righteous', cursive",
  luxury: "'Cinzel', serif",
  dynamic: "'Black Ops One', cursive",
};

export const FontSelector: React.FC = () => {
  const { fontCombination, setFontCombination, t } = useTheme();

  return (
    <div className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
      <div className="flex items-center gap-1.5 mb-2">
        <Type className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-medium text-neutral-200">{t('fonts.title')}</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {fontOptions.map((font) => (
          <button
            key={font.id}
            onClick={() => setFontCombination(font.id)}
            className={`relative flex flex-col items-center justify-center p-1 rounded-md border transition-all ${
              fontCombination === font.id
                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                : 'border-neutral-600 hover:border-neutral-500'
            }`}
            title={t(`fonts.${font.id}`)}
          >
            <div 
              className={`text-sm transition-all ${
                fontCombination === font.id ? 'text-amber-400' : 'text-neutral-400'
              }`}
              style={{ fontFamily: fontFamilyMap[font.id] }}
            >
              {font.preview}
            </div>
            <span className={`text-[7px] font-medium uppercase tracking-wide ${
              fontCombination === font.id ? 'text-amber-400' : 'text-neutral-500'
            }`}>
              {font.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FontSelector;