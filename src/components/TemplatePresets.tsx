import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Layout, Sparkles } from 'lucide-react';

export interface TemplatePreset {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  thumbnail: string;
  layout: 'espn' | 'fifa' | 'opta' | 'minimal' | 'dynamic';
}

const presets: TemplatePreset[] = [
  {
    id: 'espn',
    name: 'ESPN Style',
    nameAr: 'نمط ESPN',
    description: 'Bold sports graphics',
    thumbnail: '🏆',
    layout: 'espn',
  },
  {
    id: 'fifa',
    name: 'FIFA Card',
    nameAr: 'بطاقة فيفا',
    description: 'Ultimate Team style',
    thumbnail: '⚽',
    layout: 'fifa',
  },
  {
    id: 'opta',
    name: 'Opta Stats',
    nameAr: 'إحصائيات أوبتا',
    description: 'Data-driven layout',
    thumbnail: '📊',
    layout: 'opta',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    nameAr: 'بسيط',
    description: 'Clean and simple',
    thumbnail: '✨',
    layout: 'minimal',
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    nameAr: 'ديناميكي',
    description: 'Action-packed',
    thumbnail: '⚡',
    layout: 'dynamic',
  },
];

interface TemplatePresetsProps {
  onSelectPreset: (preset: TemplatePreset) => void;
}

export const TemplatePresets: React.FC<TemplatePresetsProps> = ({ onSelectPreset }) => {
  const { language } = useTheme();
  const isArabic = language === 'ar';

  return (
    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
      <div className="flex items-center gap-2 mb-3">
        <Layout className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-neutral-200">
          {isArabic ? 'قوالب جاهزة' : 'Templates'}
        </span>
        <Sparkles className="w-3 h-3 text-amber-400/60" />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="flex flex-col items-center gap-1 p-2 bg-neutral-900/50 hover:bg-neutral-700/50 border border-neutral-600 hover:border-amber-500/50 rounded-lg transition-all group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{preset.thumbnail}</span>
            <span className="text-xs text-neutral-300 group-hover:text-amber-400 transition-colors">
              {isArabic ? preset.nameAr : preset.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
