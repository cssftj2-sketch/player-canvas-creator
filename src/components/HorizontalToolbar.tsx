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

  const handleItemClick = (itemId: string) => {
    onAddComponent(itemId);
    setExpandedCategory(null);
  };

  return (
    <div ref={toolbarRef} className="w-full bg-card border-b border-border shadow-lg relative" style={{ zIndex: 9999 }}>
      <div className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto scrollbar-thin">
        {componentCategories.map((category) => (
          <div key={category.id} className="relative flex-shrink-0">
            <button
              onClick={() => toggleCategory(category.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-all text-xs ${
                expandedCategory === category.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {React.cloneElement(category.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
              <span className="font-medium">{category.label}</span>
              {expandedCategory === category.id ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {expandedCategory === category.id && (
              <div 
                className="fixed mt-1 bg-card border border-border rounded-lg shadow-2xl min-w-[180px] p-1.5 max-h-[350px] overflow-y-auto"
                style={{ 
                  zIndex: 99999,
                  top: 'auto',
                  left: 'auto',
                }}
              >
                <div className="grid grid-cols-2 gap-1">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item.id);
                      }}
                      className="flex items-center gap-1.5 p-1.5 rounded-md border border-transparent bg-muted/30 hover:bg-primary/10 hover:border-primary/30 transition-all text-left group"
                    >
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        {React.cloneElement(item.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                      </div>
                      <span className="text-[10px] text-foreground/80 group-hover:text-foreground transition-colors truncate">
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
