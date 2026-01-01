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
    <div className="p-4 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Type className="w-4 h-4 text-primary" />
        <span className="text-sm font-heading text-foreground">{t('fonts.title')}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {fontOptions.map((font) => (
          <button
            key={font.id}
            onClick={() => setFontCombination(font.id)}
            className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              fontCombination === font.id
                ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                : 'border-border hover:border-muted-foreground'
            }`}
            title={t(`fonts.${font.id}`)}
          >
            <div 
              className={`text-2xl mb-1 transition-all ${
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
            <span className={`text-[10px] font-heading uppercase tracking-wider ${
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
