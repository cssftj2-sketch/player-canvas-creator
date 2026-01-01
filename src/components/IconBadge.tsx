import React from 'react';
import { Rnd } from 'react-rnd';
import { 
  Trophy, Star, Target, Award, Zap, Heart, 
  Shield, Flag, Medal, Crown, Flame, Sparkles 
} from 'lucide-react';

export type IconType = 'trophy' | 'star' | 'target' | 'award' | 'zap' | 'heart' | 'shield' | 'flag' | 'medal' | 'crown' | 'flame' | 'sparkles';

interface IconBadgeProps {
  id: string;
  icon: IconType;
  color: 'gold' | 'emerald';
  size: 'lg' | 'md' | 'sm';
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  customColor?: string;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  target: Target,
  award: Award,
  zap: Zap,
  heart: Heart,
  shield: Shield,
  flag: Flag,
  medal: Medal,
  crown: Crown,
  flame: Flame,
  sparkles: Sparkles,
};

const sizeClasses = {
  lg: { container: 'w-20 h-20', icon: 'w-10 h-10' },
  md: { container: 'w-14 h-14', icon: 'w-7 h-7' },
  sm: { container: 'w-10 h-10', icon: 'w-5 h-5' },
};

const sizePixels = {
  lg: 80,
  md: 56,
  sm: 40,
};

const colorClasses = {
  gold: {
    bg: 'bg-primary/20',
    border: 'border-primary',
    text: 'text-primary',
    glow: 'shadow-[0_0_20px_hsl(var(--primary)/0.4)]',
  },
  emerald: {
    bg: 'bg-secondary/20',
    border: 'border-secondary',
    text: 'text-secondary',
    glow: 'shadow-[0_0_20px_hsl(var(--secondary)/0.4)]',
  },
};

export const IconBadge: React.FC<IconBadgeProps> = ({
  id,
  icon,
  color,
  size,
  position,
  onPositionChange,
  onSelect,
  isSelected,
  customColor,
}) => {
  const IconComponent = iconMap[icon];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <Rnd
      position={position}
      size={{ width: sizePixels[size], height: sizePixels[size] }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      className={`cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
    >
      <div
        className={`${sizeClasses[size].container} flex items-center justify-center rounded-xl ${colorClasses[color].bg} ${colorClasses[color].border} border-2 ${colorClasses[color].glow} transition-all hover:scale-105`}
        onClick={handleClick}
      >
        <IconComponent 
          className={`${sizeClasses[size].icon} ${colorClasses[color].text}`}
          style={{ color: customColor || undefined }}
        />
      </div>
    </Rnd>
  );
};
