import React, { useState, useEffect, useRef } from 'react';
import { 
  Circle, 
  Square, 
  BarChart3, 
  Type, 
  Trophy, 
  Target, 
  Zap, 
  Star,
  Award,
  Hash,
  Minus,
  Heart,
  Shield,
  Flag,
  Crown,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface HorizontalToolbarProps {
  onAddComponent: (componentId: string) => void;
}

const componentCategories = [
  {
    id: 'stats',
    label: 'Stats',
    icon: <Hash className="w-4 h-4" />,
    items: [
      { id: 'circle-lg', name: 'Large Circle', icon: <Circle className="w-5 h-5" /> },
      { id: 'circle-md', name: 'Medium Circle', icon: <Circle className="w-4 h-4" /> },
      { id: 'circle-sm', name: 'Small Circle', icon: <Circle className="w-3 h-3" /> },
      { id: 'stat-box', name: 'Stat Box', icon: <Square className="w-5 h-5" /> },
      { id: 'mini-stat', name: 'Mini Stat', icon: <Hash className="w-5 h-5" /> },
      { id: 'progress-bar', name: 'Progress Bar', icon: <Minus className="w-5 h-5" /> },
    ]
  },
  {
    id: 'badges',
    label: 'Badges',
    icon: <Trophy className="w-4 h-4" />,
    items: [
      { id: 'rating-badge', name: 'Rating', icon: <Star className="w-5 h-5" /> },
      { id: 'icon-trophy', name: 'Trophy', icon: <Trophy className="w-5 h-5" /> },
      { id: 'icon-award', name: 'Award', icon: <Award className="w-5 h-5" /> },
      { id: 'icon-target', name: 'Target', icon: <Target className="w-5 h-5" /> },
      { id: 'icon-crown', name: 'Crown', icon: <Crown className="w-5 h-5" /> },
      { id: 'icon-flame', name: 'Flame', icon: <Flame className="w-5 h-5" /> },
      { id: 'icon-star', name: 'Star', icon: <Star className="w-5 h-5" /> },
      { id: 'icon-shield', name: 'Shield', icon: <Shield className="w-5 h-5" /> },
      { id: 'icon-heart', name: 'Heart', icon: <Heart className="w-5 h-5" /> },
      { id: 'icon-zap', name: 'Lightning', icon: <Zap className="w-5 h-5" /> },
      { id: 'icon-flag', name: 'Flag', icon: <Flag className="w-5 h-5" /> },
      { id: 'icon-sparkles', name: 'Sparkles', icon: <Sparkles className="w-5 h-5" /> },
    ]
  },
  {
    id: 'charts',
    label: 'Charts',
    icon: <BarChart3 className="w-4 h-4" />,
    items: [
      { id: 'line-chart', name: 'Line Chart', icon: <BarChart3 className="w-5 h-5" /> },
      { id: 'bar-chart', name: 'Bar Chart', icon: <BarChart3 className="w-5 h-5" /> },
    ]
  },
  {
    id: 'text',
    label: 'Text',
    icon: <Type className="w-4 h-4" />,
    items: [
      { id: 'player-name', name: 'Player Name', icon: <Type className="w-5 h-5" /> },
      { id: 'header-banner', name: 'Header', icon: <Type className="w-4 h-4" /> },
      { id: 'text-label', name: 'Label', icon: <Type className="w-3 h-3" /> },
    ]
  },
  {
    id: 'shapes',
    label: 'Shapes',
    icon: <Minus className="w-4 h-4" />,
    items: [
      { id: 'divider-h', name: 'H-Line', icon: <Minus className="w-5 h-5" /> },
      { id: 'divider-v', name: 'V-Line', icon: <Minus className="w-5 h-5 rotate-90" /> },
    ]
  }
];

export const HorizontalToolbar: React.FC<HorizontalToolbarProps> = ({ onAddComponent }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setExpandedCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div ref={toolbarRef} className="w-full bg-card border-b border-border shadow-lg relative z-50">
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-thin" style={{ overflowY: 'visible' }}>
        {componentCategories.map((category) => (
          <div key={category.id} className="relative flex-shrink-0">
            <button
              onClick={() => toggleCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                expandedCategory === category.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {category.icon}
              <span className="text-sm font-heading">{category.label}</span>
              {expandedCategory === category.id ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {expandedCategory === category.id && (
              <div 
                className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-xl min-w-[200px] p-2 max-h-[400px] overflow-y-auto"
                style={{ zIndex: 9999 }}
              >
                <div className="grid grid-cols-2 gap-1">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onAddComponent(item.id);
                        setExpandedCategory(null);
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/30 hover:bg-muted hover:border-primary/50 transition-all text-left group"
                    >
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors truncate">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalToolbar;
