import React, { useRef, useState, useCallback } from 'react';
import { StatCircle } from './StatCircle';
import { StatBox } from './StatBox';
import { PlayerName } from './PlayerName';
import { PerformanceChart } from './PerformanceChart';
import { PlayerImage } from './PlayerImage';
import { HeaderBanner } from './HeaderBanner';
import { MiniStatBox } from './MiniStatBox';
import { RatingBadge } from './RatingBadge';
import { removeBackground, loadImage } from '@/lib/backgroundRemoval';
import { toast } from 'sonner';

interface TemplateState {
  circles: {
    id: string;
    value: string;
    label: string;
    color: 'gold' | 'emerald';
    size: 'lg' | 'md' | 'sm';
    position: { x: number; y: number };
  }[];
  boxes: {
    id: string;
    value: string;
    label: string;
    subStats?: { label: string; value: string }[];
    position: { x: number; y: number };
  }[];
  playerName: {
    id: string;
    firstName: string;
    lastName: string;
    number: string;
    country: string;
    position: { x: number; y: number };
  };
  chart: {
    id: string;
    data: { value: number }[];
    title: string;
    position: { x: number; y: number };
  };
  playerImage: {
    id: string;
    imageUrl: string | null;
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
  header: {
    id: string;
    title: string;
    subtitle: string;
    position: { x: number; y: number };
  };
  miniStats: {
    id: string;
    value: string;
    label: string;
    sublabel?: string;
    position: { x: number; y: number };
  }[];
  rating: {
    id: string;
    value: string;
    label: string;
    position: { x: number; y: number };
  };
}

const initialState: TemplateState = {
  circles: [
    { id: 'circle1', value: '78%', label: 'passaggi riusciti', color: 'gold', size: 'lg', position: { x: 40, y: 100 } },
    { id: 'circle2', value: '52%', label: 'contrasti vinti', color: 'emerald', size: 'md', position: { x: 80, y: 280 } },
    { id: 'circle3', value: '85%', label: 'precisione tiri', color: 'gold', size: 'sm', position: { x: 40, y: 420 } },
  ],
  boxes: [
    { 
      id: 'box1', 
      value: '2', 
      label: 'GOAL', 
      subStats: [
        { label: 'Bundesliga', value: '4|0' },
        { label: 'Algeria', value: '1|0' }
      ],
      position: { x: 30, y: 540 } 
    },
  ],
  playerName: {
    id: 'playerName',
    firstName: 'IBRAHIM',
    lastName: 'MAZA',
    number: '22',
    country: 'ALGERIA',
    position: { x: 420, y: 320 },
  },
  chart: {
    id: 'chart1',
    data: [
      { value: 2 }, { value: -3 }, { value: 5 }, { value: 8 }, 
      { value: -2 }, { value: 6 }, { value: 4 }, { value: -5 },
      { value: 7 }, { value: 3 }, { value: -1 }, { value: 4 },
    ],
    title: 'MATCH PERFORMANCE',
    position: { x: 480, y: 520 },
  },
  playerImage: {
    id: 'playerImage',
    imageUrl: null,
    position: { x: 220, y: 120 },
    size: { width: 350, height: 450 },
  },
  header: {
    id: 'header',
    title: 'FANTASTATISTICHE',
    subtitle: '4ª GIORNATA RITORNO',
    position: { x: 30, y: 20 },
  },
  miniStats: [
    { id: 'mini1', value: '684', label: 'MIN', sublabel: 'giocati', position: { x: 300, y: 590 } },
    { id: 'mini2', value: '19', label: 'TIRI', sublabel: 'totali', position: { x: 200, y: 680 } },
    { id: 'mini3', value: '26', label: 'SCA', sublabel: 'azioni create', position: { x: 310, y: 680 } },
  ],
  rating: {
    id: 'rating',
    value: '7.2',
    label: 'FANTAMEDIA',
    position: { x: 30, y: 680 },
  },
};

export const TemplateCanvas: React.FC = () => {
  const [state, setState] = useState<TemplateState>(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updatePosition = useCallback((category: keyof TemplateState, id: string, position: { x: number; y: number }) => {
    setState(prev => {
      if (Array.isArray(prev[category])) {
        return {
          ...prev,
          [category]: (prev[category] as any[]).map(item =>
            item.id === id ? { ...item, position } : item
          ),
        };
      }
      if ((prev[category] as any).id === id) {
        return {
          ...prev,
          [category]: { ...prev[category] as any, position },
        };
      }
      return prev;
    });
  }, []);

  const handleCircleValueChange = useCallback((id: string, value: string, label: string) => {
    setState(prev => ({
      ...prev,
      circles: prev.circles.map(c => c.id === id ? { ...c, value, label } : c),
    }));
  }, []);

  const handleBoxValueChange = useCallback((id: string, value: string, label: string) => {
    setState(prev => ({
      ...prev,
      boxes: prev.boxes.map(b => b.id === id ? { ...b, value, label } : b),
    }));
  }, []);

  const handleMiniStatValueChange = useCallback((id: string, value: string, label: string) => {
    setState(prev => ({
      ...prev,
      miniStats: prev.miniStats.map(m => m.id === id ? { ...m, value, label } : m),
    }));
  }, []);

  const handlePlayerNameChange = useCallback((id: string, data: { firstName: string; lastName: string; number: string; country: string }) => {
    setState(prev => ({
      ...prev,
      playerName: { ...prev.playerName, ...data },
    }));
  }, []);

  const handleHeaderChange = useCallback((id: string, title: string, subtitle: string) => {
    setState(prev => ({
      ...prev,
      header: { ...prev.header, title, subtitle },
    }));
  }, []);

  const handleRatingChange = useCallback((id: string, value: string, label: string) => {
    setState(prev => ({
      ...prev,
      rating: { ...prev.rating, value, label },
    }));
  }, []);

  const handleImageSizeChange = useCallback((id: string, size: { width: number; height: number }) => {
    setState(prev => ({
      ...prev,
      playerImage: { ...prev.playerImage, size },
    }));
  }, []);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const processImage = useCallback(async (file: File) => {
    try {
      setIsProcessing(true);
      setProgress(0);
      toast.info('Processing image...', { duration: 2000 });

      const img = await loadImage(file);
      setProgress(20);

      const resultBlob = await removeBackground(img, setProgress);
      const imageUrl = URL.createObjectURL(resultBlob);

      setState(prev => ({
        ...prev,
        playerImage: { ...prev.playerImage, imageUrl },
      }));

      toast.success('Background removed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to remove background. Using original image.');
      
      // Fallback to original image
      const imageUrl = URL.createObjectURL(file);
      setState(prev => ({
        ...prev,
        playerImage: { ...prev.playerImage, imageUrl },
      }));
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
    e.target.value = '';
  }, [processImage]);

  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center p-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Canvas */}
      <div 
        className="relative w-[750px] h-[850px] gradient-dark rounded-2xl overflow-hidden shadow-2xl border border-border"
        style={{
          backgroundImage: 'radial-gradient(circle at 70% 30%, hsl(var(--muted)) 0%, transparent 50%)',
        }}
      >
        {/* Grid overlay for visual effect */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Header */}
        <HeaderBanner
          {...state.header}
          onPositionChange={(id, pos) => updatePosition('header', id, pos)}
          onValueChange={handleHeaderChange}
        />

        {/* Player Image */}
        <PlayerImage
          {...state.playerImage}
          onPositionChange={(id, pos) => updatePosition('playerImage', id, pos)}
          onSizeChange={handleImageSizeChange}
          onImageUpload={handleImageUpload}
          isProcessing={isProcessing}
          progress={progress}
        />

        {/* Stat Circles */}
        {state.circles.map(circle => (
          <StatCircle
            key={circle.id}
            {...circle}
            onPositionChange={(id, pos) => updatePosition('circles', id, pos)}
            onValueChange={handleCircleValueChange}
          />
        ))}

        {/* Stat Boxes */}
        {state.boxes.map(box => (
          <StatBox
            key={box.id}
            {...box}
            onPositionChange={(id, pos) => updatePosition('boxes', id, pos)}
            onValueChange={handleBoxValueChange}
          />
        ))}

        {/* Player Name */}
        <PlayerName
          {...state.playerName}
          onPositionChange={(id, pos) => updatePosition('playerName', id, pos)}
          onValueChange={handlePlayerNameChange}
        />

        {/* Performance Chart */}
        <PerformanceChart
          {...state.chart}
          onPositionChange={(id, pos) => updatePosition('chart', id, pos)}
        />

        {/* Mini Stats */}
        {state.miniStats.map(stat => (
          <MiniStatBox
            key={stat.id}
            {...stat}
            onPositionChange={(id, pos) => updatePosition('miniStats', id, pos)}
            onValueChange={handleMiniStatValueChange}
          />
        ))}

        {/* Rating Badge */}
        <RatingBadge
          {...state.rating}
          onPositionChange={(id, pos) => updatePosition('rating', id, pos)}
          onValueChange={handleRatingChange}
        />
      </div>
    </div>
  );
};
