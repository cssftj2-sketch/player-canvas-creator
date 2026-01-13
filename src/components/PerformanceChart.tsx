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
      size={{ width: 240, height: 140 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      style={{ zIndex }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 rounded-lg' : ''}`}
    >
      <div 
        className="w-full h-full bg-neutral-900/60 backdrop-blur-sm border border-neutral-700 rounded-lg p-3 hover:ring-2 ring-amber-500/30 transition-all"
        onClick={handleClick}
      >
        <h4 
          className="text-xs font-heading uppercase mb-2 tracking-wider"
          style={{ color: textColor || 'rgba(255,255,255,0.8)' }}
        >
          {title}
        </h4>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeOpacity={0.3} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div 
          className="flex justify-between text-[10px] mt-1"
          style={{ color: numberColor || 'rgba(255,255,255,0.6)' }}
        >
          <span>-10</span>
          <span style={{ color: textColor || 'rgba(255,255,255,0.5)' }}>MATCH TREND</span>
          <span>+10</span>
        </div>
      </div>
    </Rnd>
  );
};