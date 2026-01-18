import React from 'react';
import { Rnd } from 'react-rnd';
import { LineChart, Line, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PerformanceChartProps {
  id: string;
  data: { value: number }[];
  title: string;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  customColor?: string;
  textColor?: string;
  numberColor?: string;
  zIndex?: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  id,
  data,
  title,
  position,
  onPositionChange,
  onSelect,
  isSelected,
  customColor,
  textColor,
  numberColor,
  zIndex = 10,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  const lineColor = customColor || 'var(--theme-primary)';

  return (
    <Rnd
      position={position}
      size={{ width: 260, height: 150 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-xl' : ''}`}
    >
      <div 
        className="relative w-full h-full bg-gradient-to-br from-neutral-900/95 via-neutral-800/90 to-neutral-900/95 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-4 hover:ring-2 ring-amber-500/30 transition-all overflow-hidden"
        style={{
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
        onClick={handleClick}
      >
        {/* Background gradient accent */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `radial-gradient(ellipse at top right, ${lineColor}40, transparent 60%)`,
          }}
        />
        
        {/* Header with accent line */}
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-1 h-4 rounded-full"
            style={{ background: lineColor }}
          />
          <h4 
            className="text-xs font-heading uppercase tracking-widest"
            style={{ color: textColor || 'rgba(255,255,255,0.9)' }}
          >
            {title}
          </h4>
        </div>
        
        <div className="h-16 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-20">
            <div className="border-b border-white/20" />
            <div className="border-b border-white/10" />
            <div className="border-b border-white/20" />
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.6} />
                  <stop offset="50%" stopColor={lineColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0.6} />
                </linearGradient>
                <filter id={`glow-chart-${id}`}>
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="value"
                stroke={`url(#gradient-${id})`}
                strokeWidth={3}
                dot={false}
                filter={`url(#glow-chart-${id})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div 
          className="flex justify-between text-[10px] mt-2 font-heading"
          style={{ color: numberColor || 'rgba(255,255,255,0.5)' }}
        >
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
            -10
          </span>
          <span 
            className="uppercase tracking-wider"
            style={{ color: textColor || 'rgba(255,255,255,0.4)' }}
          >
            trend
          </span>
          <span className="flex items-center gap-1">
            +10
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
          </span>
        </div>
      </div>
    </Rnd>
  );
};