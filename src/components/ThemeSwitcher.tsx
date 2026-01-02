import React from 'react';
import { useTheme, ColorTheme, Language } from '@/contexts/ThemeContext';
import { Palette, Globe } from 'lucide-react';

const themes: { id: ColorTheme; name: string; colors: string[] }[] = [
  { id: 'gold-emerald', name: 'Gold & Emerald', colors: ['#D4AF37', '#059669'] },
  { id: 'blue-silver', name: 'Blue & Silver', colors: ['#3B82F6', '#94A3B8'] },
  { id: 'red-black', name: 'Red & Black', colors: ['#DC2626', '#1F2937'] },
  { id: 'purple-gold', name: 'Purple & Gold', colors: ['#7C3AED', '#F59E0B'] },
  { id: 'green-white', name: 'Green & White', colors: ['#10B981', '#F8FAFC'] },
];

const languages: { id: Language; name: string; native: string }[] = [
  { id: 'en', name: 'English', native: 'EN' },
  { id: 'ar', name: 'Arabic', native: 'ع' },
];

export const ThemeSwitcher: React.FC = () => {
  const { colorTheme, setColorTheme, language, setLanguage, t } = useTheme();

  return (
    <div className="flex flex-col gap-3 p-3 bg-card rounded-lg border border-border">
      {/* Color Theme */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Palette className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">{t('theme.title')}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setColorTheme(theme.id)}
              className={`relative flex items-center gap-0.5 p-1.5 rounded-md border transition-all ${
                colorTheme === theme.id
                  ? 'border-primary ring-1 ring-primary/30'
                  : 'border-border hover:border-muted-foreground'
              }`}
              title={theme.name}
            >
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">{t('language.title')}</span>
        </div>
        <div className="flex gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                language === lang.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              {lang.native}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};