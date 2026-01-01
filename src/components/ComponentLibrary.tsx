import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Circle, 
  Square, 
  BarChart3, 
  Type, 
  Trophy, 
  Target, 
  Zap, 
  Star,
  TrendingUp,
  Award,
  Percent,
  Hash,
  Minus,
  Heart,
  Shield,
  Flag,
  Crown,
  Flame,
  Sparkles
} from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  category: 'stats' | 'badges' | 'charts' | 'text' | 'shapes';
}

const components: ComponentItem[] = [
  // Stats
  { id: 'circle-lg', name: 'Large Circle', nameAr: 'دائرة كبيرة', icon: <Circle className="w-5 h-5" />, category: 'stats' },
  { id: 'circle-md', name: 'Medium Circle', nameAr: 'دائرة متوسطة', icon: <Circle className="w-4 h-4" />, category: 'stats' },
  { id: 'circle-sm', name: 'Small Circle', nameAr: 'دائرة صغيرة', icon: <Circle className="w-3 h-3" />, category: 'stats' },
  { id: 'stat-box', name: 'Stat Box', nameAr: 'صندوق إحصائيات', icon: <Square className="w-5 h-5" />, category: 'stats' },
  { id: 'mini-stat', name: 'Mini Stat', nameAr: 'إحصاء صغير', icon: <Hash className="w-5 h-5" />, category: 'stats' },
  { id: 'progress-bar', name: 'Progress Bar', nameAr: 'شريط التقدم', icon: <Percent className="w-5 h-5" />, category: 'stats' },
  
  // Badges
  { id: 'rating-badge', name: 'Rating Badge', nameAr: 'شارة التقييم', icon: <Star className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-trophy', name: 'Trophy', nameAr: 'كأس', icon: <Trophy className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-award', name: 'Award', nameAr: 'جائزة', icon: <Award className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-target', name: 'Target', nameAr: 'هدف', icon: <Target className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-crown', name: 'Crown', nameAr: 'تاج', icon: <Crown className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-flame', name: 'Flame', nameAr: 'لهب', icon: <Flame className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-star', name: 'Star', nameAr: 'نجمة', icon: <Star className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-shield', name: 'Shield', nameAr: 'درع', icon: <Shield className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-heart', name: 'Heart', nameAr: 'قلب', icon: <Heart className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-zap', name: 'Lightning', nameAr: 'برق', icon: <Zap className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-flag', name: 'Flag', nameAr: 'علم', icon: <Flag className="w-5 h-5" />, category: 'badges' },
  { id: 'icon-sparkles', name: 'Sparkles', nameAr: 'بريق', icon: <Sparkles className="w-5 h-5" />, category: 'badges' },
  
  // Charts
  { id: 'line-chart', name: 'Line Chart', nameAr: 'رسم بياني خطي', icon: <TrendingUp className="w-5 h-5" />, category: 'charts' },
  { id: 'bar-chart', name: 'Bar Chart', nameAr: 'رسم بياني شريطي', icon: <BarChart3 className="w-5 h-5" />, category: 'charts' },
  
  // Text
  { id: 'player-name', name: 'Player Name', nameAr: 'اسم اللاعب', icon: <Type className="w-5 h-5" />, category: 'text' },
  { id: 'header-banner', name: 'Header Banner', nameAr: 'شعار العنوان', icon: <Type className="w-4 h-4" />, category: 'text' },
  { id: 'text-label', name: 'Text Label', nameAr: 'نص', icon: <Type className="w-3 h-3" />, category: 'text' },
  
  // Shapes
  { id: 'divider-h', name: 'Horizontal Line', nameAr: 'خط أفقي', icon: <Minus className="w-5 h-5" />, category: 'shapes' },
  { id: 'divider-v', name: 'Vertical Line', nameAr: 'خط عمودي', icon: <Minus className="w-5 h-5 rotate-90" />, category: 'shapes' },
];

interface ComponentLibraryProps {
  onAddComponent: (componentId: string) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddComponent }) => {
  const { t, language } = useTheme();
  
  const categories = [
    { id: 'stats', label: t('library.stats') },
    { id: 'badges', label: t('library.badges') },
    { id: 'charts', label: t('library.charts') },
    { id: 'text', label: t('library.text') },
    { id: 'shapes', label: t('library.shapes') },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-xl border border-border max-h-[350px] overflow-y-auto">
      <h3 className="text-sm font-heading text-foreground flex items-center gap-2">
        <Square className="w-4 h-4 text-primary" />
        {t('library.title')}
      </h3>
      
      {categories.map((category) => (
        <div key={category.id}>
          <h4 className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-2">
            {category.label}
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {components
              .filter((c) => c.category === category.id)
              .map((component) => (
                <button
                  key={component.id}
                  onClick={() => onAddComponent(component.id)}
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/30 hover:bg-muted hover:border-primary/50 transition-all text-left group"
                >
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    {component.icon}
                  </div>
                  <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors truncate">
                    {language === 'ar' ? component.nameAr : component.name}
                  </span>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
