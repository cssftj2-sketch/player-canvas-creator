import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ColorTheme = 'gold-emerald' | 'blue-silver' | 'red-black' | 'purple-gold' | 'green-white';
export type Language = 'en' | 'ar';

export interface CanvasBackground {
  type: 'solid' | 'gradient' | 'radial';
  color1: string;
  color2: string;
  angle: number;
}

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
  canvasBackground: CanvasBackground;
  setCanvasBackground: (bg: CanvasBackground) => void;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'header.title': 'PLAYER STATS BUILDER',
    'header.subtitle': 'CREATE STUNNING FOOTBALL INFOGRAPHICS',
    'tip.doubleClick': 'Double-click elements to edit',
    'tip.drag': 'Drag elements to reposition',
    'footer.tip': 'Upload a player image • Edit stats by double-clicking • Drag elements to customize layout',
    'upload.title': 'Click to upload player image',
    'upload.subtitle': 'Background will be removed automatically',
    'upload.processing': 'Removing background...',
    'theme.title': 'Theme',
    'language.title': 'Language',
    'library.title': 'Components',
    'library.stats': 'Statistics',
    'library.badges': 'Badges',
    'library.charts': 'Charts',
    'library.text': 'Text',
    'library.shapes': 'Shapes',
    'stat.passes': 'successful passes',
    'stat.tackles': 'tackles won',
    'stat.shots': 'shot accuracy',
    'stat.goals': 'GOALS',
    'stat.minutes': 'MIN',
    'stat.played': 'played',
    'stat.total': 'total',
    'stat.actions': 'actions created',
    'stat.rating': 'FANTASY RATING',
    'performance': 'MATCH PERFORMANCE',
    'matchday': '4TH MATCHDAY RETURN',
    'fantastats': 'FANTASY STATS',
    'background.title': 'Background',
    'background.solid': 'Solid',
    'background.gradient': 'Gradient',
    'background.radial': 'Radial',
    'export.title': 'Export',
    'export.png': 'Download PNG',
    'export.jpg': 'Download JPG',
    'export.pdf': 'Download PDF',
    'properties.title': 'Properties',
    'properties.color': 'Color',
    'properties.size': 'Size',
    'properties.delete': 'Delete',
  },
  ar: {
    'header.title': 'منشئ إحصائيات اللاعب',
    'header.subtitle': 'إنشاء رسوم بيانية رائعة لكرة القدم',
    'tip.doubleClick': 'انقر مرتين لتحرير العناصر',
    'tip.drag': 'اسحب العناصر لإعادة ترتيبها',
    'footer.tip': 'قم بتحميل صورة اللاعب • حرر الإحصائيات بالنقر المزدوج • اسحب العناصر لتخصيص التخطيط',
    'upload.title': 'انقر لتحميل صورة اللاعب',
    'upload.subtitle': 'ستتم إزالة الخلفية تلقائياً',
    'upload.processing': 'جاري إزالة الخلفية...',
    'theme.title': 'السمة',
    'language.title': 'اللغة',
    'library.title': 'المكونات',
    'library.stats': 'الإحصائيات',
    'library.badges': 'الشارات',
    'library.charts': 'الرسوم البيانية',
    'library.text': 'النص',
    'library.shapes': 'الأشكال',
    'stat.passes': 'تمريرات ناجحة',
    'stat.tackles': 'تدخلات فائزة',
    'stat.shots': 'دقة التسديد',
    'stat.goals': 'أهداف',
    'stat.minutes': 'دقيقة',
    'stat.played': 'لعب',
    'stat.total': 'إجمالي',
    'stat.actions': 'صناعة الفرص',
    'stat.rating': 'التقييم الفانتازي',
    'performance': 'أداء المباراة',
    'matchday': 'الجولة الرابعة',
    'fantastats': 'إحصائيات فانتازي',
    'background.title': 'الخلفية',
    'background.solid': 'صلب',
    'background.gradient': 'تدرج',
    'background.radial': 'شعاعي',
    'export.title': 'تصدير',
    'export.png': 'تحميل PNG',
    'export.jpg': 'تحميل JPG',
    'export.pdf': 'تحميل PDF',
    'properties.title': 'الخصائص',
    'properties.color': 'اللون',
    'properties.size': 'الحجم',
    'properties.delete': 'حذف',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('gold-emerald');
  const [language, setLanguage] = useState<Language>('en');
  const [canvasBackground, setCanvasBackground] = useState<CanvasBackground>({
    type: 'gradient',
    color1: '#141414',
    color2: '#0a0a0a',
    angle: 180,
  });

  const isRTL = language === 'ar';

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    root.classList.remove('theme-gold-emerald', 'theme-blue-silver', 'theme-red-black', 'theme-purple-gold', 'theme-green-white');
    // Add current theme class
    root.classList.add(`theme-${colorTheme}`);
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, language, setLanguage, isRTL, t, canvasBackground, setCanvasBackground }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
