import React, { useRef, useState, useCallback } from 'react';
import { StatCircle } from './StatCircle';
import { StatBox } from './StatBox';
import { PlayerName } from './PlayerName';
import { PerformanceChart } from './PerformanceChart';
import { PlayerImage } from './PlayerImage';
import { HeaderBanner } from './HeaderBanner';
import { MiniStatBox } from './MiniStatBox';
import { RatingBadge } from './RatingBadge';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ComponentLibrary } from './ComponentLibrary';
import { BackgroundEditor } from './BackgroundEditor';
import { ExportControls } from './ExportControls';
import { PropertyEditor, ComponentData } from './PropertyEditor';
import { ProgressBar } from './ProgressBar';
import { Divider } from './Divider';
import { IconBadge, IconType } from './IconBadge';
import { TextLabel } from './TextLabel';
import { removeBackground, loadImage } from '@/lib/backgroundRemoval';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

interface CircleState {
  id: string;
  value: string;
  label: string;
  color: 'gold' | 'emerald';
  size: 'lg' | 'md' | 'sm';
  position: { x: number; y: number };
  customColor?: string;
}

interface BoxState {
  id: string;
  value: string;
  label: string;
  subStats?: { label: string; value: string }[];
  position: { x: number; y: number };
  customColor?: string;
}

interface MiniStatState {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
  position: { x: number; y: number };
  customColor?: string;
}

interface ProgressBarState {
  id: string;
  value: number;
  label: string;
  color: 'gold' | 'emerald';
  position: { x: number; y: number };
  size: { width: number; height: number };
  customColor?: string;
}

interface DividerState {
  id: string;
  orientation: 'horizontal' | 'vertical';
  color: 'gold' | 'emerald';
  position: { x: number; y: number };
  size: { width: number; height: number };
  customColor?: string;
}

interface IconBadgeState {
  id: string;
  icon: IconType;
  color: 'gold' | 'emerald';
  size: 'lg' | 'md' | 'sm';
  position: { x: number; y: number };
  customColor?: string;
}

interface TextLabelState {
  id: string;
  text: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  color: 'gold' | 'emerald';
  position: { x: number; y: number };
  customColor?: string;
}

interface TemplateState {
  circles: CircleState[];
  boxes: BoxState[];
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
  miniStats: MiniStatState[];
  rating: {
    id: string;
    value: string;
    label: string;
    position: { x: number; y: number };
  };
  progressBars: ProgressBarState[];
  dividers: DividerState[];
  iconBadges: IconBadgeState[];
  textLabels: TextLabelState[];
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
  progressBars: [],
  dividers: [],
  iconBadges: [],
  textLabels: [],
};

export const TemplateCanvas: React.FC = () => {
  const { t, isRTL, canvasBackground } = useTheme();
  const [state, setState] = useState<TemplateState>(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getBackgroundStyle = () => {
    switch (canvasBackground.type) {
      case 'solid':
        return { background: canvasBackground.color1 };
      case 'gradient':
        return { background: `linear-gradient(${canvasBackground.angle}deg, ${canvasBackground.color1}, ${canvasBackground.color2})` };
      case 'radial':
        return { background: `radial-gradient(circle at 50% 30%, ${canvasBackground.color1}, ${canvasBackground.color2})` };
      default:
        return {};
    }
  };

  const handleCanvasClick = () => {
    setSelectedComponent(null);
  };

  const handleSelectComponent = (id: string) => {
    setSelectedComponent(id);
  };

  const getSelectedComponentData = (): ComponentData | null => {
    if (!selectedComponent) return null;

    // Check circles
    const circle = state.circles.find(c => c.id === selectedComponent);
    if (circle) {
      return {
        id: circle.id,
        type: 'circle',
        value: circle.value,
        label: circle.label,
        color: circle.color,
        size: circle.size,
        customColor: circle.customColor,
      };
    }

    // Check boxes
    const box = state.boxes.find(b => b.id === selectedComponent);
    if (box) {
      return {
        id: box.id,
        type: 'box',
        value: box.value,
        label: box.label,
        customColor: box.customColor,
      };
    }

    // Check miniStats
    const mini = state.miniStats.find(m => m.id === selectedComponent);
    if (mini) {
      return {
        id: mini.id,
        type: 'miniStat',
        value: mini.value,
        label: mini.label,
        sublabel: mini.sublabel,
        customColor: mini.customColor,
      };
    }

    // Check progressBars
    const bar = state.progressBars.find(p => p.id === selectedComponent);
    if (bar) {
      return {
        id: bar.id,
        type: 'progressBar',
        value: bar.value.toString(),
        label: bar.label,
        color: bar.color,
        customColor: bar.customColor,
      };
    }

    // Check dividers
    const divider = state.dividers.find(d => d.id === selectedComponent);
    if (divider) {
      return {
        id: divider.id,
        type: 'divider',
        color: divider.color,
        customColor: divider.customColor,
      };
    }

    // Check iconBadges
    const icon = state.iconBadges.find(i => i.id === selectedComponent);
    if (icon) {
      return {
        id: icon.id,
        type: 'icon',
        color: icon.color,
        size: icon.size,
        customColor: icon.customColor,
      };
    }

    // Check textLabels
    const text = state.textLabels.find(t => t.id === selectedComponent);
    if (text) {
      return {
        id: text.id,
        type: 'chart',
        value: text.text,
        fontSize: text.fontSize,
        color: text.color,
        customColor: text.customColor,
      };
    }

    // Check rating
    if (selectedComponent === 'rating') {
      return {
        id: 'rating',
        type: 'rating',
        value: state.rating.value,
        label: state.rating.label,
      };
    }

    return null;
  };

  const handleUpdateComponent = (data: Partial<ComponentData>) => {
    if (!selectedComponent) return;

    setState(prev => {
      // Update circles
      const circleIdx = prev.circles.findIndex(c => c.id === selectedComponent);
      if (circleIdx !== -1) {
        const updated = [...prev.circles];
        updated[circleIdx] = { ...updated[circleIdx], ...data };
        return { ...prev, circles: updated };
      }

      // Update boxes
      const boxIdx = prev.boxes.findIndex(b => b.id === selectedComponent);
      if (boxIdx !== -1) {
        const updated = [...prev.boxes];
        updated[boxIdx] = { ...updated[boxIdx], ...data };
        return { ...prev, boxes: updated };
      }

      // Update miniStats
      const miniIdx = prev.miniStats.findIndex(m => m.id === selectedComponent);
      if (miniIdx !== -1) {
        const updated = [...prev.miniStats];
        updated[miniIdx] = { ...updated[miniIdx], ...data };
        return { ...prev, miniStats: updated };
      }

      // Update progressBars
      const barIdx = prev.progressBars.findIndex(p => p.id === selectedComponent);
      if (barIdx !== -1) {
        const updated = [...prev.progressBars];
        updated[barIdx] = { ...updated[barIdx], ...data, value: parseInt(data.value || '0') };
        return { ...prev, progressBars: updated };
      }

      // Update dividers
      const dividerIdx = prev.dividers.findIndex(d => d.id === selectedComponent);
      if (dividerIdx !== -1) {
        const updated = [...prev.dividers];
        updated[dividerIdx] = { ...updated[dividerIdx], ...data };
        return { ...prev, dividers: updated };
      }

      // Update iconBadges
      const iconIdx = prev.iconBadges.findIndex(i => i.id === selectedComponent);
      if (iconIdx !== -1) {
        const updated = [...prev.iconBadges];
        updated[iconIdx] = { ...updated[iconIdx], ...data };
        return { ...prev, iconBadges: updated };
      }

      // Update textLabels
      const textIdx = prev.textLabels.findIndex(t => t.id === selectedComponent);
      if (textIdx !== -1) {
        const updated = [...prev.textLabels];
        updated[textIdx] = { ...updated[textIdx], text: data.value || updated[textIdx].text, ...data };
        return { ...prev, textLabels: updated };
      }

      // Update rating
      if (selectedComponent === 'rating') {
        return { ...prev, rating: { ...prev.rating, ...data } };
      }

      return prev;
    });
  };

  const handleDeleteComponent = () => {
    if (!selectedComponent) return;

    setState(prev => ({
      ...prev,
      circles: prev.circles.filter(c => c.id !== selectedComponent),
      boxes: prev.boxes.filter(b => b.id !== selectedComponent),
      miniStats: prev.miniStats.filter(m => m.id !== selectedComponent),
      progressBars: prev.progressBars.filter(p => p.id !== selectedComponent),
      dividers: prev.dividers.filter(d => d.id !== selectedComponent),
      iconBadges: prev.iconBadges.filter(i => i.id !== selectedComponent),
      textLabels: prev.textLabels.filter(t => t.id !== selectedComponent),
    }));
    setSelectedComponent(null);
    toast.success('Component deleted');
  };

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

  const updateSize = useCallback((category: keyof TemplateState, id: string, size: { width: number; height: number }) => {
    setState(prev => {
      if (Array.isArray(prev[category])) {
        return {
          ...prev,
          [category]: (prev[category] as any[]).map(item =>
            item.id === id ? { ...item, size } : item
          ),
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

  const handleProgressBarValueChange = useCallback((id: string, value: number, label: string) => {
    setState(prev => ({
      ...prev,
      progressBars: prev.progressBars.map(p => p.id === id ? { ...p, value, label } : p),
    }));
  }, []);

  const handleTextLabelChange = useCallback((id: string, text: string) => {
    setState(prev => ({
      ...prev,
      textLabels: prev.textLabels.map(t => t.id === id ? { ...t, text } : t),
    }));
  }, []);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const processImage = useCallback(async (file: File) => {
    try {
      setIsProcessing(true);
      setProgress(0);
      toast.info(t('upload.processing'), { duration: 2000 });

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
      
      const imageUrl = URL.createObjectURL(file);
      setState(prev => ({
        ...prev,
        playerImage: { ...prev.playerImage, imageUrl },
      }));
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [t]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
    e.target.value = '';
  }, [processImage]);

  const handleAddComponent = useCallback((componentId: string) => {
    const centerX = 350;
    const centerY = 400;
    
    switch (componentId) {
      case 'circle-lg':
        setState(prev => ({
          ...prev,
          circles: [...prev.circles, {
            id: `circle-${Date.now()}`,
            value: '0%',
            label: 'New Stat',
            color: 'gold',
            size: 'lg',
            position: { x: centerX, y: centerY },
          }],
        }));
        break;
      case 'circle-md':
        setState(prev => ({
          ...prev,
          circles: [...prev.circles, {
            id: `circle-${Date.now()}`,
            value: '0%',
            label: 'New Stat',
            color: 'emerald',
            size: 'md',
            position: { x: centerX, y: centerY },
          }],
        }));
        break;
      case 'circle-sm':
        setState(prev => ({
          ...prev,
          circles: [...prev.circles, {
            id: `circle-${Date.now()}`,
            value: '0%',
            label: 'New Stat',
            color: 'gold',
            size: 'sm',
            position: { x: centerX, y: centerY },
          }],
        }));
        break;
      case 'mini-stat':
        setState(prev => ({
          ...prev,
          miniStats: [...prev.miniStats, {
            id: `mini-${Date.now()}`,
            value: '0',
            label: 'STAT',
            sublabel: 'label',
            position: { x: centerX, y: centerY },
          }],
        }));
        break;
      case 'stat-box':
        setState(prev => ({
          ...prev,
          boxes: [...prev.boxes, {
            id: `box-${Date.now()}`,
            value: '0',
            label: 'NEW',
            position: { x: centerX, y: centerY },
          }],
        }));
        break;
      case 'progress-bar':
        setState(prev => ({
          ...prev,
          progressBars: [...prev.progressBars, {
            id: `bar-${Date.now()}`,
            value: 75,
            label: 'Progress',
            color: 'gold',
            position: { x: centerX, y: centerY },
            size: { width: 200, height: 40 },
          }],
        }));
        break;
      case 'divider-h':
        setState(prev => ({
          ...prev,
          dividers: [...prev.dividers, {
            id: `divider-${Date.now()}`,
            orientation: 'horizontal',
            color: 'gold',
            position: { x: centerX, y: centerY },
            size: { width: 150, height: 4 },
          }],
        }));
        break;
      case 'divider-v':
        setState(prev => ({
          ...prev,
          dividers: [...prev.dividers, {
            id: `divider-${Date.now()}`,
            orientation: 'vertical',
            color: 'gold',
            position: { x: centerX, y: centerY },
            size: { width: 4, height: 100 },
          }],
        }));
        break;
      case 'icon-trophy':
      case 'icon-award':
      case 'icon-target':
      case 'icon-crown':
      case 'icon-flame':
      case 'icon-star':
      case 'icon-shield':
      case 'icon-heart':
      case 'icon-zap':
      case 'icon-flag':
      case 'icon-sparkles':
        const iconType = componentId.replace('icon-', '') as IconType;
        setState(prev => ({
          ...prev,
          iconBadges: [...prev.iconBadges, {
            id: `icon-${Date.now()}`,
            icon: iconType,
            color: 'gold',
            size: 'md',
            position: { x: centerX, y: centerY },
          }],
        }));
        break;
      case 'text-label':
        setState(prev => ({
          ...prev,
          textLabels: [...prev.textLabels, {
            id: `text-${Date.now()}`,
            text: 'Label',
            fontSize: 24,
            fontWeight: 'bold',
            color: 'gold',
            position: { x: centerX, y: centerY },
          }],
        }));
        break;
      default:
        toast.info('Component added to canvas');
    }
  }, []);

  return (
    <div className={`relative w-full min-h-screen flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Left Sidebar */}
      <aside className={`w-72 p-4 flex flex-col gap-4 border-border bg-card/50 overflow-y-auto max-h-screen ${isRTL ? 'border-l' : 'border-r'}`}>
        <ThemeSwitcher />
        <BackgroundEditor />
        <ComponentLibrary onAddComponent={handleAddComponent} />
        <ExportControls canvasRef={canvasRef} />
      </aside>

      {/* Main Canvas */}
      <div className="flex-1 flex items-center justify-center p-8" onClick={handleCanvasClick}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="relative w-[750px] h-[850px] rounded-2xl overflow-hidden shadow-2xl border border-border"
          style={getBackgroundStyle()}
          onClick={handleCanvasClick}
        >
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
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
            onSelect={handleSelectComponent}
            isSelected={selectedComponent === state.header.id}
          />

          {/* Player Image */}
          <PlayerImage
            {...state.playerImage}
            onPositionChange={(id, pos) => updatePosition('playerImage', id, pos)}
            onSizeChange={handleImageSizeChange}
            onImageUpload={handleImageUpload}
            isProcessing={isProcessing}
            progress={progress}
            onSelect={handleSelectComponent}
            isSelected={selectedComponent === state.playerImage.id}
          />

          {/* Stat Circles */}
          {state.circles.map(circle => (
            <StatCircle
              key={circle.id}
              {...circle}
              onPositionChange={(id, pos) => updatePosition('circles', id, pos)}
              onValueChange={handleCircleValueChange}
              onSelect={handleSelectComponent}
              isSelected={selectedComponent === circle.id}
            />
          ))}

          {/* Stat Boxes */}
          {state.boxes.map(box => (
            <StatBox
              key={box.id}
              {...box}
              onPositionChange={(id, pos) => updatePosition('boxes', id, pos)}
              onValueChange={handleBoxValueChange}
              onSelect={handleSelectComponent}
              isSelected={selectedComponent === box.id}
            />
          ))}

          {/* Player Name */}
          <PlayerName
            {...state.playerName}
            onPositionChange={(id, pos) => updatePosition('playerName', id, pos)}
            onValueChange={handlePlayerNameChange}
            onSelect={handleSelectComponent}
            isSelected={selectedComponent === state.playerName.id}
          />

          {/* Performance Chart */}
          <PerformanceChart
            {...state.chart}
            onPositionChange={(id, pos) => updatePosition('chart', id, pos)}
            onSelect={handleSelectComponent}
            isSelected={selectedComponent === state.chart.id}
          />

          {/* Mini Stats */}
          {state.miniStats.map(stat => (
            <MiniStatBox
              key={stat.id}
              {...stat}
              onPositionChange={(id, pos) => updatePosition('miniStats', id, pos)}
              onValueChange={handleMiniStatValueChange}
              onSelect={handleSelectComponent}
              isSelected={selectedComponent === stat.id}
            />
          ))}

          {/* Rating Badge */}
          <RatingBadge
            {...state.rating}
            onPositionChange={(id, pos) => updatePosition('rating', id, pos)}
            onValueChange={handleRatingChange}
            onSelect={handleSelectComponent}
            isSelected={selectedComponent === state.rating.id}
          />

          {/* Progress Bars */}
          {state.progressBars.map(bar => (
            <ProgressBar
              key={bar.id}
              {...bar}
              onPositionChange={(id, pos) => updatePosition('progressBars', id, pos)}
              onSizeChange={(id, size) => updateSize('progressBars', id, size)}
              onValueChange={handleProgressBarValueChange}
              onSelect={handleSelectComponent}
              isSelected={selectedComponent === bar.id}
            />
          ))}

          {/* Dividers */}
          {state.dividers.map(divider => (
            <Divider
              key={divider.id}
              {...divider}
              onPositionChange={(id, pos) => updatePosition('dividers', id, pos)}
              onSizeChange={(id, size) => updateSize('dividers', id, size)}
              onSelect={handleSelectComponent}
              isSelected={selectedComponent === divider.id}
            />
          ))}

          {/* Icon Badges */}
          {state.iconBadges.map(icon => (
            <IconBadge
              key={icon.id}
              {...icon}
              onPositionChange={(id, pos) => updatePosition('iconBadges', id, pos)}
              onSelect={handleSelectComponent}
              isSelected={selectedComponent === icon.id}
            />
          ))}

          {/* Text Labels */}
          {state.textLabels.map(text => (
            <TextLabel
              key={text.id}
              {...text}
              onPositionChange={(id, pos) => updatePosition('textLabels', id, pos)}
              onValueChange={handleTextLabelChange}
              onSelect={handleSelectComponent}
              isSelected={selectedComponent === text.id}
            />
          ))}
        </div>
      </div>

      {/* Right Sidebar - Property Editor */}
      {selectedComponent && (
        <aside className={`w-72 p-4 border-border bg-card/50 ${isRTL ? 'border-r' : 'border-l'}`}>
          <PropertyEditor
            component={getSelectedComponentData()}
            onUpdate={handleUpdateComponent}
            onDelete={handleDeleteComponent}
            onClose={() => setSelectedComponent(null)}
          />
        </aside>
      )}
    </div>
  );
};
