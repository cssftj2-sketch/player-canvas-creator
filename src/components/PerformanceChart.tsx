import React from 'react';
import { Rnd } from 'react-rnd';
import { LineChart, Line, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PerformanceChartProps {
  id: string;
  data: { value: number }[];
  title: string;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  id,
  data,
  title,
  position,
  onPositionChange,
}) => {
  return (
    <Rnd
      position={position}
      size={{ width: 240, height: 140 }}
      onDragStop={(e, d) => onPositionChange(id, { x: d.x, y: d.y })}
      enableResizing={false}
      bounds="parent"
      className="cursor-move"
    >
      <div className="w-full h-full bg-card/60 backdrop-blur-sm border border-border rounded-lg p-3 hover:ring-2 ring-gold/30 transition-all">
        <h4 className="text-xs font-heading uppercase text-foreground/80 mb-2 tracking-wider">
          {title}
        </h4>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--gold))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>-10</span>
          <span className="text-foreground/60">ANDAMENTO PARTITE</span>
          <span>+10</span>
        </div>
      </div>
    </Rnd>
  );
};
