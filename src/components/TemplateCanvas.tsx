import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { HorizontalToolbar } from './HorizontalToolbar';
import { AIPlayerSearch } from './AIPlayerSearch';
import { FontSelector } from './FontSelector';
import { removeBackground, loadImage } from '@/lib/backgroundRemoval';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { RotateCcw, Plus } from 'lucide-react'; // Added for New Project icon

// --- Interfaces ---
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
  const [removeBackgroundEnabled, setRemoveBackgroundEnabled] = useState(true);
  const [zoomScale, setZoomScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- NEW PROJECT FEATURE ---
  const handleNewProject = () => {
    if (window.confirm("Are you sure you want to start a new project? All current progress will be lost.")) {
      setState(initialState);
      setSelectedComponent(null);
      toast.success("New project created successfully");
    }
  };

  // --- RESPONSIVE FIX: Auto-scale canvas to fit screen ---
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth - (selectedComponent ? 650 : 350);
      const scale = Math.min(containerWidth / 750, 1);
      setZoomScale(scale < 0.4 ? 0.4 : scale);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedComponent]);

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

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedComponent(null);
    }
  };

  const handleSelectComponent = (id: string) => {
    setSelectedComponent(id);
  };

  const handlePlayerSelect = useCallback((playerData: any) => {
    setState(prev => ({
      ...prev,
      playerName: {
        ...prev.playerName,
        firstName: playerData.name.split(' ')[0] || '',
        lastName: playerData.name.split(' ').slice(1).join(' ') || '',
        country: playerData.nationality,
      },
      circles: prev.circles.map((circle, idx) => {
        if (idx === 0) return { ...circle, value: `${playerData.stats.passAccuracy}%`, label: 'Pass Accuracy' };
        if (idx === 1) return { ...circle, value: `${playerData.stats.tacklesWon}`, label: 'Tackles Won' };
        return circle;
      }),
      boxes: prev.boxes.map(box => ({
        ...box,
        value: playerData.stats.goals.toString(),
        label: 'GOALS',
      })),
      miniStats: [
        { ...prev.miniStats[0], value: playerData.stats.appearances.toString(), label: 'APPS' },
        { ...prev.miniStats[1], value: playerData.stats.assists.toString(), label: 'ASSISTS' },
        { ...prev.miniStats[2], value: playerData.stats.goals.toString(), label: 'GOALS' },
      ],
      rating: {
        ...prev.rating,
        value: playerData.stats.rating.toString(),
      }
    }));
  }, []);

  const getSelectedComponentData = (): ComponentData | null => {
    if (!selectedComponent) return null;

    const circle = state.circles.find(c => c.id === selectedComponent);
    if (circle) return { id: circle.id, type: 'circle', value: circle.value, label: circle.label, color: circle.color, size: circle.size, customColor: circle.customColor };

    const box = state.boxes.find(b => b.id === selectedComponent);
    if (box) return { id: box.id, type: 'box', value: box.value, label: box.label, customColor: box.customColor };

    const mini = state.miniStats.find(m => m.id === selectedComponent);
    if (mini) return { id: mini.id, type: 'miniStat', value: mini.value, label: mini.label, sublabel: mini.sublabel, customColor: mini.customColor };

    const bar = state.progressBars.find(p => p.id === selectedComponent);
    if (bar) return { id: bar.id, type: 'progressBar', value: bar.value.toString(), label: bar.label, color: bar.color, customColor: bar.customColor };

    const divider = state.dividers.find(d => d.id === selectedComponent);
    if (divider) return { id: divider.id, type: 'divider', color: divider.color, customColor: divider.customColor };

    const icon = state.iconBadges.find(i => i.id === selectedComponent);
    if (icon) return { id: icon.id, type: 'icon', color: icon.color, size: icon.size, customColor: icon.customColor };

    const text = state.textLabels.find(t => t.id === selectedComponent);
    if (text) return { id: text.id, type: 'chart', value: text.text, fontSize: text.fontSize, color: text.color, customColor: text.customColor };

    if (selectedComponent === 'rating') return { id: 'rating', type: 'rating', value: state.rating.value, label: state.rating.label };
    
    return null;
  };

  const handleUpdateComponent = (data: Partial<ComponentData>) => {
    if (!selectedComponent) return;

    setState(prev => {
      const circleIdx = prev.circles.findIndex(c => c.id === selectedComponent);
      if (circleIdx !== -1) {
        const updated = [...prev.circles];
        updated[circleIdx] = { ...updated[circleIdx], ...data };
        return { ...prev, circles: updated };
      }

      const boxIdx = prev.boxes.findIndex(b => b.id === selectedComponent);
      if (boxIdx !== -1) {
        const updated = [...prev.boxes];
        updated[boxIdx] = { ...updated[boxIdx], ...data };
        return { ...prev, boxes: updated };
      }

      const miniIdx = prev.miniStats.findIndex(m => m.id === selectedComponent);
      if (miniIdx !== -1) {
        const updated = [...prev.miniStats];
        updated[miniIdx] = { ...updated[miniIdx], ...data };
        return { ...prev, miniStats: updated };
      }

      const barIdx = prev.progressBars.findIndex(p => p.id === selectedComponent);
      if (barIdx !== -1) {
        const updated = [...prev.progressBars];
        const { size, ...restData } = data as any;
        updated[barIdx] = { ...updated[barIdx], ...restData, value: parseInt(data.value || updated[barIdx].value.toString()) };
        return { ...prev, progressBars: updated };
      }

      const dividerIdx = prev.dividers.findIndex(d => d.id === selectedComponent);
      if (dividerIdx !== -1) {
        const updated = [...prev.dividers];
        const { size, ...restData } = data as any;
        updated[dividerIdx] = { ...updated[dividerIdx], ...restData };
        return { ...prev, dividers: updated };
      }

      const iconIdx = prev.iconBadges.findIndex(i => i.id === selectedComponent);
      if (iconIdx !== -1) {
        const updated = [...prev.iconBadges];
        updated[iconIdx] = { ...updated[iconIdx], ...data };
        return { ...prev, iconBadges: updated };
      }

      const textIdx = prev.textLabels.findIndex(t => t.id === selectedComponent);
      if (textIdx !== -1) {
        const updated = [...prev.textLabels];
        updated[textIdx] = { ...updated[textIdx], text: data.value || updated[textIdx].text, ...data };
        return { ...prev, textLabels: updated };
      }

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

  const handleImageUpload = useCallback((shouldRemoveBackground: boolean = true) => {
    setRemoveBackgroundEnabled(shouldRemoveBackground);
    fileInputRef.current?.click();
  }, []);

  const processImage = useCallback(async (file: File, shouldRemoveBackground: boolean) => {
    try {
      if (shouldRemoveBackground) {
        setIsProcessing(true);
        setProgress(0);
        toast.info(t('upload.processing'), { duration: 2000 });
        const img = await loadImage(file);
        setProgress(20);
        const resultBlob = await removeBackground(img, setProgress);
        const imageUrl = URL.createObjectURL(resultBlob);
        setState(prev => ({ ...prev, playerImage: { ...prev.playerImage, imageUrl } }));
        toast.success('Background removed successfully!');
      } else {
        const imageUrl = URL.createObjectURL(file);
        setState(prev => ({ ...prev, playerImage: { ...prev.playerImage, imageUrl } }));
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to remove background. Using original image.');
      const imageUrl = URL.createObjectURL(file);
      setState(prev => ({ ...prev, playerImage: { ...prev.playerImage, imageUrl } }));
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [t]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file, removeBackgroundEnabled);
    e.target.value = '';
  }, [processImage, removeBackgroundEnabled]);

  const handleAddComponent = useCallback((componentId: string) => {
    const centerX = 350;
    const centerY = 400;
    
    switch (componentId) {
      case 'circle-lg':
        setState(prev => ({ ...prev, circles: [...prev.circles, { id: `circle-${Date.now()}`, value: '0%', label: 'New Stat', color: 'gold', size: 'lg', position: { x: centerX, y: centerY } }] }));
        break;
      case 'circle-md':
        setState(prev => ({ ...prev, circles: [...prev.circles, { id: `circle-${Date.now()}`, value: '0%', label: 'New Stat', color: 'emerald', size: 'md', position: { x: centerX, y: centerY } }] }));
        break;
      case 'circle-sm':
        setState(prev => ({ ...prev, circles: [...prev.circles, { id: `circle-${Date.now()}`, value: '0%', label: 'New Stat', color: 'gold', size: 'sm', position: { x: centerX, y: centerY } }] }));
        break;
      case 'mini-stat':
        setState(prev => ({ ...prev, miniStats: [...prev.miniStats, { id: `mini-${Date.now()}`, value: '0', label: 'STAT', sublabel: 'label', position: { x: centerX, y: centerY } }] }));
        break;
      case 'stat-box':
        setState(prev => ({ ...prev, boxes: [...prev.boxes, { id: `box-${Date.now()}`, value: '0', label: 'NEW', position: { x: centerX, y: centerY } }] }));
        break;
      case 'progress-bar':
        setState(prev => ({ ...prev, progressBars: [...prev.progressBars, { id: `bar-${Date.now()}`, value: 75, label: 'Progress', color: 'gold', position: { x: centerX, y: centerY }, size: { width: 200, height: 40 } }] }));
        break;
      case 'divider-h':
        setState(prev => ({ ...prev, dividers: [...prev.dividers, { id: `divider-${Date.now()}`, orientation: 'horizontal', color: 'gold', position: { x: centerX, y: centerY }, size: { width: 150, height: 4 } }] }));
        break;
      case 'divider-v':
        setState(prev => ({ ...prev, dividers: [...prev.dividers, { id: `divider-${Date.now()}`, orientation: 'vertical', color: 'gold', position: { x: centerX, y: centerY }, size: { width: 4, height: 100 } }] }));
        break;
      case 'text-label':
        setState(prev => ({ ...prev, textLabels: [...prev.textLabels, { id: `text-${Date.now()}`, text: 'Label', fontSize: 24, fontWeight: 'bold', color: 'gold', position: { x: centerX, y: centerY } }] }));
        break;
      default:
        if (componentId.startsWith('icon-')) {
          const iconType = componentId.replace('icon-', '') as IconType;
          setState(prev => ({ ...prev, iconBadges: [...prev.iconBadges, { id: `icon-${Date.now()}`, icon: iconType, color: 'gold', size: 'md', position: { x: centerX, y: centerY } }] }));
        }
    }
  }, []);

  return (
    // FIX: Container structure to prevent overlap and handle sidebar fixed height
    <div className={`flex flex-col h-screen w-full bg-[#121212] overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* TOOLBAR: High Z-Index to prevent overlap */}
      <div className="z-[100] border-b border-white/10 bg-[#1A1A1A] relative h-16 shrink-0 flex items-center justify-between px-4">
        <HorizontalToolbar onAddComponent={handleAddComponent} />
        
        {/* NEW PROJECT BUTTON */}
        <button 
          onClick={handleNewProject}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 rounded transition-all text-sm font-medium"
        >
          <RotateCcw size={16} />
          New Project
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR: "DONT WANNA ASIDEBARE SCROLLING" -> Scrollbar Hidden */}
        <aside className="w-80 border-r border-white/10 bg-[#1A1A1A] flex flex-col overflow-hidden shrink-0">
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-8 select-none">
            {/* Using a custom utility or inline style to hide scrollbar */}
            <style dangerouslySetInnerHTML={{__html: `
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
            
            <ThemeSwitcher />
            <FontSelector />
            <AIPlayerSearch onPlayerSelect={handlePlayerSelect} />
            <BackgroundEditor />
            <ExportControls canvasRef={canvasRef} />
          </div>
        </aside>

        {/* MAIN WORKSPACE: Centered Canvas */}
        <main 
          className="flex-1 overflow-auto bg-[#0a0a0a] flex items-center justify-center p-10 relative scrollbar-thin scrollbar-thumb-white/10"
          onClick={handleCanvasClick}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          {/* RESPONSIVE SCALE WRAPPER */}
          <div 
            style={{ 
              transform: `scale(${zoomScale})`, 
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out'
            }}
            className="shrink-0 flex items-center justify-center"
          >
            <div 
              ref={canvasRef}
              className="relative w-[750px] h-[850px] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 select-none"
              style={getBackgroundStyle()}
              onClick={handleCanvasClick}
            >
              {/* Grid Background Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

              {/* Components */}
              <HeaderBanner {...state.header} onPositionChange={(id, pos) => updatePosition('header', id, pos)} onValueChange={handleHeaderChange} onSelect={handleSelectComponent} isSelected={selectedComponent === state.header.id} />

              <PlayerImage {...state.playerImage} onPositionChange={(id, pos) => updatePosition('playerImage', id, pos)} onSizeChange={handleImageSizeChange} onImageUpload={handleImageUpload} isProcessing={isProcessing} progress={progress} onSelect={handleSelectComponent} isSelected={selectedComponent === state.playerImage.id} removeBackgroundEnabled={removeBackgroundEnabled} onToggleRemoveBackground={() => setRemoveBackgroundEnabled(!removeBackgroundEnabled)} />

              {state.circles.map(c => <StatCircle key={c.id} {...c} onPositionChange={(id, pos) => updatePosition('circles', id, pos)} onValueChange={handleCircleValueChange} onSelect={handleSelectComponent} isSelected={selectedComponent === c.id} />)}
              {state.boxes.map(b => <StatBox key={b.id} {...b} onPositionChange={(id, pos) => updatePosition('boxes', id, pos)} onValueChange={handleBoxValueChange} onSelect={handleSelectComponent} isSelected={selectedComponent === b.id} />)}
              
              <PlayerName {...state.playerName} onPositionChange={(id, pos) => updatePosition('playerName', id, pos)} onValueChange={handlePlayerNameChange} onSelect={handleSelectComponent} isSelected={selectedComponent === state.playerName.id} />
              
              <PerformanceChart {...state.chart} onPositionChange={(id, pos) => updatePosition('chart', id, pos)} onSelect={handleSelectComponent} isSelected={selectedComponent === state.chart.id} />
              
              {state.miniStats.map(m => <MiniStatBox key={m.id} {...m} onPositionChange={(id, pos) => updatePosition('miniStats', id, pos)} onValueChange={handleMiniStatValueChange} onSelect={handleSelectComponent} isSelected={selectedComponent === m.id} />)}
              
              <RatingBadge {...state.rating} onPositionChange={(id, pos) => updatePosition('rating', id, pos)} onValueChange={handleRatingChange} onSelect={handleSelectComponent} isSelected={selectedComponent === state.rating.id} />
              
              {state.progressBars.map(bar => <ProgressBar key={bar.id} {...bar} onPositionChange={(id, pos) => updatePosition('progressBars', id, pos)} onSizeChange={(id, size) => updateSize('progressBars', id, size)} onValueChange={handleProgressBarValueChange} onSelect={handleSelectComponent} isSelected={selectedComponent === bar.id} />)}
              
              {state.dividers.map(d => <Divider key={d.id} {...d} onPositionChange={(id, pos) => updatePosition('dividers', id, pos)} onSizeChange={(id, size) => updateSize('dividers', id, size)} onSelect={handleSelectComponent} isSelected={selectedComponent === d.id} />)}
              
              {state.iconBadges.map(i => <IconBadge key={i.id} {...i} onPositionChange={(id, pos) => updatePosition('iconBadges', id, pos)} onSelect={handleSelectComponent} isSelected={selectedComponent === i.id} />)}
              
              {state.textLabels.map(t => <TextLabel key={t.id} {...t} onPositionChange={(id, pos) => updatePosition('textLabels', id, pos)} onValueChange={handleTextLabelChange} onSelect={handleSelectComponent} isSelected={selectedComponent === t.id} />)}
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: Property Editor with Smooth Transitions */}
        <AnimatePresence mode="wait">
          {selectedComponent && (
            <motion.aside
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 border-l border-white/10 bg-[#1A1A1A] z-50 flex flex-col shrink-0 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <PropertyEditor
                  component={getSelectedComponentData()}
                  onUpdate={handleUpdateComponent}
                  onDelete={handleDeleteComponent}
                  onClose={() => setSelectedComponent(null)}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};