import React from 'react';
import { useTheme, FontCombination } from '@/contexts/ThemeContext';
import { Type } from 'lucide-react';

const fontOptions: { id: FontCombination; name: string; preview: string }[] = [
  { id: 'modern', name: 'Modern', preview: 'Aa' },
  { id: 'classic', name: 'Classic', preview: 'Aa' },
  { id: 'bold', name: 'Bold', preview: 'Aa' },
  { id: 'elegant', name: 'Elegant', preview: 'Aa' },
  { id: 'tech', name: 'Tech', preview: 'Aa' },
];

export const FontSelector: React.FC = () => {
  const { fontCombination, setFontCombination, t } = useTheme();

  return (
    <div className="p-3 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-1.5 mb-2">
        <Type className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium text-foreground">{t('fonts.title')}</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {fontOptions.map((font) => (
          <button
            key={font.id}
            onClick={() => setFontCombination(font.id)}
            className={`relative flex flex-col items-center justify-center p-1.5 rounded-md border transition-all ${
              fontCombination === font.id
                ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                : 'border-border hover:border-muted-foreground'
            }`}
            title={t(`fonts.${font.id}`)}
          >
            <div 
              className={`text-lg transition-all ${
                fontCombination === font.id ? 'text-primary' : 'text-muted-foreground'
              }`}
              style={{
                fontFamily: font.id === 'modern' ? "'Bebas Neue', sans-serif" :
                           font.id === 'classic' ? "'Playfair Display', serif" :
                           font.id === 'bold' ? "'Anton', sans-serif" :
                           font.id === 'elegant' ? "'Cormorant Garamond', serif" :
                           "'Orbitron', sans-serif"
              }}
            >
              {font.preview}
            </div>
            <span className={`text-[8px] font-medium uppercase tracking-wide ${
              fontCombination === font.id ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {t(`fonts.${font.id}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FontSelector;