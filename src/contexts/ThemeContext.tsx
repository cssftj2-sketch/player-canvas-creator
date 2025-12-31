import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ColorTheme = 'gold-emerald' | 'blue-silver' | 'red-black' | 'purple-gold' | 'green-white';
export type Language = 'en' | 'ar';

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
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
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('gold-emerald');
  const [language, setLanguage] = useState<Language>('en');

  const isRTL = language === 'ar';

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, language, setLanguage, isRTL, t }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={`theme-${colorTheme}`}>
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
