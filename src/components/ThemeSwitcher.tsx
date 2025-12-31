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
  { id: 'en', name: 'English', native: 'English' },
  { id: 'ar', name: 'Arabic', native: 'العربية' },
];

export const ThemeSwitcher: React.FC = () => {
  const { colorTheme, setColorTheme, language, setLanguage, t } = useTheme();

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-xl border border-border">
      {/* Color Theme */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-sm font-heading text-foreground">{t('theme.title')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setColorTheme(theme.id)}
              className={`relative flex items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                colorTheme === theme.id
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-muted-foreground'
              }`}
              title={theme.name}
            >
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-heading text-foreground">{t('language.title')}</span>
        </div>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-heading transition-all ${
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
