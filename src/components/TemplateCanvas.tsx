import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { StatCircle } from './StatCircle';
import { StatBox } from './StatBox';
import { PlayerName } from './PlayerName';
import { PerformanceChart } from './PerformanceChart';
import { PlayerImage } from './PlayerImage';
import { HeaderBanner } from './HeaderBanner';
import { MiniStatBox } from './MiniStatBox';
import { RatingBadge } from './RatingBadge';
import { ThemeSwitcher } from './ThemeSwitcher';
import { BackgroundEditor } from './BackgroundEditor';
import { ExportControls } from './ExportControls';
import { PropertyEditor, ComponentData } from './PropertyEditor';
import { ProgressBar } from './ProgressBar';
import { Divider } from './Divider';
import { IconBadge, IconType } from './IconBadge';
import { TextLabel } from './TextLabel';
import { HorizontalToolbar } from './HorizontalToolbar';
import { DataTable } from './DataTable';
import AIPlayerSearch from './AIPlayerSearch';
import { FontSelector } from './FontSelector';
import { removeBackground, loadImage } from '@/lib/backgroundRemoval';
import { useTheme } from '@/contexts/ThemeContext';
import { Table } from 'lucide-react';

// Type definitions
interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface BaseComponent {
  id: string;
  position: Position;
  zIndex?: number;
}

interface CircleState extends BaseComponent {
  value: string;
  label: string;
  color: 'gold' | 'emerald';
  size: 'lg' | 'md' | 'sm';
  customColor?: string;
  textColor?: string;
  numberColor?: string;
}

interface BoxState extends BaseComponent {
  value: string;
  label: string;
  subStats?: { label: string; value: string }[];
  customColor?: string;
  textColor?: string;
  numberColor?: string;
}

interface MiniStatState extends BaseComponent {
  value: string;
  label: string;
  sublabel?: string;
  customColor?: string;
  textColor?: string;
  numberColor?: string;
}

interface ProgressBarState extends BaseComponent {
  value: number;
  label: string;
  color: 'gold' | 'emerald';
  size: Size;
  customColor?: string;
}

interface DividerState extends BaseComponent {
  orientation: 'horizontal' | 'vertical';
  color: 'gold' | 'emerald';
  size: Size;
  customColor?: string;
}

interface IconBadgeState extends BaseComponent {
  icon: IconType;
  color: 'gold' | 'emerald';
  size: 'lg' | 'md' | 'sm';
  customColor?: string;
}

interface TextLabelState extends BaseComponent {
  text: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  color: 'gold' | 'emerald';
  customColor?: string;
}

interface ChartState extends BaseComponent {
  data: { value: number }[];
  title: string;
  customColor?: string;
}

interface PlayerData {
  name: string;
  nationality: string;
  stats: {
    passAccuracy: number;
    tacklesWon: number;
    goals: number;
    appearances: number;
    assists: number;
    rating: number;
  };
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
    position: Position;
    zIndex?: number;
  };
  chart: ChartState;
  playerImage: {
    id: string;
    imageUrl: string | null;
    position: Position;
    size: Size;
    zIndex?: number;
  };
  header: {
    id: string;
    title: string;
    subtitle: string;
    position: Position;
    zIndex?: number;
  };
  miniStats: MiniStatState[];
  rating: {
    id: string;
    value: string;
    label: string;
    position: Position;
    zIndex?: number;
  };
  progressBars: ProgressBarState[];
  dividers: DividerState[];
  iconBadges: IconBadgeState[];
  textLabels: TextLabelState[];
}

// Constants
const CANVAS_WIDTH = 750;
const CANVAS_HEIGHT = 850;
const CANVAS_CENTER_X = CANVAS_WIDTH / 2;
const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const initialState: TemplateState = {
  circles: [
    { id: 'circle1', value: '78%', label: 'passaggi riusciti', color: 'gold', size: 'lg', position: { x: 40, y: 100 }, zIndex: 10 },
    { id: 'circle2', value: '52%', label: 'contrasti vinti', color: 'emerald', size: 'md', position: { x: 80, y: 280 }, zIndex: 10 },
    { id: 'circle3', value: '85%', label: 'precisione tiri', color: 'gold', size: 'sm', position: { x: 40, y: 420 }, zIndex: 10 },
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
      position: { x: 30, y: 540 },
      zIndex: 10
    },
  ],
  playerName: {
    id: 'playerName',
    firstName: 'IBRAHIM',
    lastName: 'MAZA',
    number: '22',
    country: 'ALGERIA',
    position: { x: 420, y: 320 },
    zIndex: 15
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
    zIndex: 10
  },
  playerImage: {
    id: 'playerImage',
    imageUrl: null,
    position: { x: 220, y: 120 },
    size: { width: 350, height: 450 },
    zIndex: 5
  },
  header: {
    id: 'header',
    title: 'FANTASTATISTICHE',
    subtitle: '4ª GIORNATA RITORNO',
    position: { x: 30, y: 20 },
    zIndex: 20
  },
  miniStats: [
    { id: 'mini1', value: '684', label: 'MIN', sublabel: 'giocati', position: { x: 300, y: 590 }, zIndex: 10 },
    { id: 'mini2', value: '19', label: 'TIRI', sublabel: 'totali', position: { x: 200, y: 680 }, zIndex: 10 },
    { id: 'mini3', value: '26', label: 'SCA', sublabel: 'azioni create', position: { x: 310, y: 680 }, zIndex: 10 },
  ],
  rating: {
    id: 'rating',
    value: '7.2',
    label: 'FANTAMEDIA',
    position: { x: 30, y: 680 },
    zIndex: 10
  },
  progressBars: [],
  dividers: [],
  iconBadges: [],
  textLabels: [],
};

// Component configuration for easy additions
const COMPONENT_CONFIGS = {
  'circle-lg': { type: 'circles', defaults: { value: '0%', label: 'New Stat', color: 'gold', size: 'lg' } },
  'circle-md': { type: 'circles', defaults: { value: '0%', label: 'New Stat', color: 'emerald', size: 'md' } },
  'circle-sm': { type: 'circles', defaults: { value: '0%', label: 'New Stat', color: 'gold', size: 'sm' } },
  'mini-stat': { type: 'miniStats', defaults: { value: '0', label: 'STAT', sublabel: 'label' } },
  'stat-box': { type: 'boxes', defaults: { value: '0', label: 'NEW' } },
  'progress-bar': { type: 'progressBars', defaults: { value: 75, label: 'Progress', color: 'gold', size: { width: 200, height: 40 } } },
  'divider-h': { type: 'dividers', defaults: { orientation: 'horizontal', color: 'gold', size: { width: 150, height: 4 } } },
  'divider-v': { type: 'dividers', defaults: { orientation: 'vertical', color: 'gold', size: { width: 4, height: 100 } } },
  'text-label': { type: 'textLabels', defaults: { text: 'Label', fontSize: 24, fontWeight: 'bold', color: 'gold' } },
};

export const TemplateCanvas: React.FC = () => {
  const { t, isRTL, canvasBackground, colorTheme } = useTheme();
  const [state, setState] = useState<TemplateState>(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [removeBackgroundEnabled, setRemoveBackgroundEnabled] = useState(true);
  const [showDataTable, setShowDataTable] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(20);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageUrlRef = useRef<string | null>(null);

  // Calculate actual max z-index from all components
  useEffect(() => {
    const allZIndexes = [
      ...state.circles.map(c => c.zIndex || 0),
      ...state.boxes.map(b => b.zIndex || 0),
      ...state.miniStats.map(m => m.zIndex || 0),
      ...state.progressBars.map(p => p.zIndex || 0),
      ...state.dividers.map(d => d.zIndex || 0),
      ...state.iconBadges.map(i => i.zIndex || 0),
      ...state.textLabels.map(t => t.zIndex || 0),
      state.playerName.zIndex || 0,
      state.chart.zIndex || 0,
      state.playerImage.zIndex || 0,
      state.header.zIndex || 0,
      state.rating.zIndex || 0,
    ];
    const currentMax = Math.max(...allZIndexes, 20);
    setMaxZIndex(currentMax);
  }, [state]);

  // Cleanup image URLs on unmount
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const getBackgroundStyle = useCallback(() => {
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
  }, [canvasBackground]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedComponent(null);
    }
  }, []);

  const handleSelectComponent = useCallback((id: string) => {
    setSelectedComponent(id);
  }, []);

  const handleBringToFront = useCallback(() => {
    if (!selectedComponent) return;
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    handleUpdateComponent({ zIndex: newZ });
    console.log('Brought to front');
  }, [selectedComponent, maxZIndex]);

  const handleSendToBack = useCallback(() => {
    if (!selectedComponent) return;
    handleUpdateComponent({ zIndex: 1 });
    console.log('Sent to back');
  }, [selectedComponent]);

  const handlePlayerSelect = useCallback((playerData: PlayerData) => {
    try {
      const nameParts = playerData.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setState(prev => ({
        ...prev,
        playerName: {
          ...prev.playerName,
          firstName,
          lastName,
          country: playerData.nationality || '',
        },
        circles: prev.circles.map((circle, idx) => {
          if (idx === 0 && playerData.stats?.passAccuracy !== undefined) {
            return { ...circle, value: `${playerData.stats.passAccuracy}%`, label: 'Pass Accuracy' };
          }
          if (idx === 1 && playerData.stats?.tacklesWon !== undefined) {
            return { ...circle, value: `${playerData.stats.tacklesWon}`, label: 'Tackles Won' };
          }
          return circle;
        }),
        boxes: prev.boxes.map(box => ({
          ...box,
          value: (playerData.stats?.goals ?? 0).toString(),
          label: 'GOALS',
        })),
        miniStats: prev.miniStats.map((stat, idx) => {
          if (idx === 0) return { ...stat, value: (playerData.stats?.appearances ?? 0).toString(), label: 'APPS' };
          if (idx === 1) return { ...stat, value: (playerData.stats?.assists ?? 0).toString(), label: 'ASSISTS' };
          if (idx === 2) return { ...stat, value: (playerData.stats?.goals ?? 0).toString(), label: 'GOALS' };
          return stat;
        }),
        rating: {
          ...prev.rating,
          value: (playerData.stats?.rating ?? 0).toString(),
        }
      }));
      
      toast.success('Player data loaded successfully');
    } catch (error) {
      console.error('Error loading player data:', error);
    }
  }, []);

  const handleDataTableChange = useCallback((data: Array<{ label: string; value: string }>) => {
    try {
      setState(prev => {
        const newMiniStats = [...prev.miniStats];
        
        data.forEach((row, idx) => {
          if (idx < newMiniStats.length && row.label && row.value) {
            newMiniStats[idx] = {
              ...newMiniStats[idx],
              value: row.value,
              label: row.label,
            };
          }
        });

        return { ...prev, miniStats: newMiniStats };
      });
      
      setShowDataTable(false);
      console.log('Data synced to canvas');
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }, []);

  const getSelectedComponentData = useCallback((): ComponentData | null => {
    if (!selectedComponent) return null;

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
        textColor: circle.textColor,
        numberColor: circle.numberColor,
        zIndex: circle.zIndex,
      };
    }

    const box = state.boxes.find(b => b.id === selectedComponent);
    if (box) {
      return {
        id: box.id,
        type: 'box',
        value: box.value,
        label: box.label,
        customColor: box.customColor,
        textColor: box.textColor,
        numberColor: box.numberColor,
        zIndex: box.zIndex,
      };
    }

    const mini = state.miniStats.find(m => m.id === selectedComponent);
    if (mini) {
      return {
        id: mini.id,
        type: 'miniStat',
        value: mini.value,
        label: mini.label,
        sublabel: mini.sublabel,
        customColor: mini.customColor,
        textColor: mini.textColor,
        numberColor: mini.numberColor,
        zIndex: mini.zIndex,
      };
    }

    const bar = state.progressBars.find(p => p.id === selectedComponent);
    if (bar) {
      return {
        id: bar.id,
        type: 'progressBar',
        value: bar.value.toString(),
        label: bar.label,
        color: bar.color,
        customColor: bar.customColor,
        zIndex: bar.zIndex,
      };
    }

    const divider = state.dividers.find(d => d.id === selectedComponent);
    if (divider) {
      return {
        id: divider.id,
        type: 'divider',
        color: divider.color,
        customColor: divider.customColor,
        zIndex: divider.zIndex,
      };
    }

    const icon = state.iconBadges.find(i => i.id === selectedComponent);
    if (icon) {
      return {
        id: icon.id,
        type: 'icon',
        color: icon.color,
        size: icon.size,
        customColor: icon.customColor,
        zIndex: icon.zIndex,
      };
    }

    const text = state.textLabels.find(t => t.id === selectedComponent);
    if (text) {
      return {
        id: text.id,
        type: 'text',
        value: text.text,
        fontSize: text.fontSize,
        color: text.color,
        customColor: text.customColor,
        zIndex: text.zIndex,
      };
    }

    if (selectedComponent === 'chart1') {
      return {
        id: 'chart1',
        type: 'chart',
        label: state.chart.title,
        customColor: state.chart.customColor,
        zIndex: state.chart.zIndex,
      };
    }

    if (selectedComponent === 'rating') {
      return {
        id: 'rating',
        type: 'rating',
        value: state.rating.value,
        label: state.rating.label,
        zIndex: state.rating.zIndex,
      };
    }

    return null;
  }, [selectedComponent, state]);

  const handleUpdateComponent = useCallback((data: Partial<ComponentData>) => {
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
        const numValue = parseInt(data.value || updated[barIdx].value.toString(), 10);
        const validValue = isNaN(numValue) ? 0 : Math.max(0, Math.min(100, numValue));
        updated[barIdx] = { ...updated[barIdx], ...data, value: validValue };
        return { ...prev, progressBars: updated };
      }

      const dividerIdx = prev.dividers.findIndex(d => d.id === selectedComponent);
      if (dividerIdx !== -1) {
        const updated = [...prev.dividers];
        updated[dividerIdx] = { ...updated[dividerIdx], ...data };
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

      if (selectedComponent === 'chart1') {
        return { ...prev, chart: { ...prev.chart, title: data.label || prev.chart.title, ...data } };
      }

      if (selectedComponent === 'rating') {
        return { ...prev, rating: { ...prev.rating, ...data } };
      }

      return prev;
    });
  }, [selectedComponent]);

  const handleDeleteComponent = useCallback(() => {
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
    console.log('Component deleted');
  }, [selectedComponent]);

  const updatePosition = useCallback((category: keyof TemplateState, id: string, position: Position) => {
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

  const updateSize = useCallback((category: keyof TemplateState, id: string, size: Size) => {
    setState(prev => {
      if (Array.isArray(prev[category])) {
        return {
          ...prev,
          [category]: (prev[category] as any[]).map(item =>
            item.id === id ? { ...item, size } : item
          ),
        };
      }
      if ((prev[category] as any).id === id) {
        return {
          ...prev,
          [category]: { ...prev[category] as any, size },
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

  const handleImageSizeChange = useCallback((id: string, size: Size) => {
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
      // Revoke previous URL if exists
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }

      if (shouldRemoveBackground) {
        setIsProcessing(true);
        setProgress(0);
        console.log('Processing image...');

        const img = await loadImage(file);
        setProgress(20);

        const resultBlob = await removeBackground(img, setProgress);
        const imageUrl = URL.createObjectURL(resultBlob);
        imageUrlRef.current = imageUrl;

        setState(prev => ({
          ...prev,
          playerImage: { ...prev.playerImage, imageUrl },
        }));

        console.log('Background removed successfully!');
      } else {
        const imageUrl = URL.createObjectURL(file);
        imageUrlRef.current = imageUrl;
        
        setState(prev => ({
          ...prev,
          playerImage: { ...prev.playerImage, imageUrl },
        }));
        console.log('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      
      const imageUrl = URL.createObjectURL(file);
      imageUrlRef.current = imageUrl;
      
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
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.error('Invalid file type');
      e.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error('File too large');
      e.target.value = '';
      return;
    }

    processImage(file, removeBackgroundEnabled);
    e.target.value = '';
  }, [processImage, removeBackgroundEnabled]);

  const handleAddComponent = useCallback((componentId: string) => {
    console.log('Adding component:', componentId);
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    
    // Handle data table separately
    if (componentId === 'data-table') {
      setShowDataTable(true);
      return;
    }

    // Handle icon components
    if (componentId.startsWith('icon-')) {
      const iconType = componentId.replace('icon-', '') as IconType;
      setState(prev => ({
        ...prev,
        iconBadges: [...prev.iconBadges, {
          id: `icon-${Date.now()}`,
          icon: iconType,
          color: 'gold',
          size: 'md',
          position: { x: CANVAS_CENTER_X, y: CANVAS_CENTER_Y },
          zIndex: newZ,
        }],
      }));
      console.log('Icon added:', iconType);
      return;
    }

    // Handle configured components
    const config = COMPONENT_CONFIGS[componentId as keyof typeof COMPONENT_CONFIGS];
    if (config) {
      const newId = `${config.type}-${Date.now()}`;
      setState(prev => ({
        ...prev,
        [config.type]: [
          ...(prev[config.type as keyof TemplateState] as any[]),
          {
            id: newId,
            ...config.defaults,
            position: { x: CANVAS_CENTER_X, y: CANVAS_CENTER_Y },
            zIndex: newZ,
          }
        ],
      }));
      console.log('Component added:', config.type, newId);
    } else {
      console.log('Unknown component:', componentId);
    }
  }, [maxZIndex]);

  const backgroundStyle = useMemo(() => getBackgroundStyle(), [getBackgroundStyle]);

  return (
    <div className={`relative w-full min-h-screen flex flex-col ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* Horizontal Toolbar */}
      <div className="w-full" style={{ overflow: 'visible' }}>
        <HorizontalToolbar onAddComponent={handleAddComponent} />
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className={`w-64 p-3 flex flex-col gap-2.5 bg-neutral-900/80 border-neutral-800 shrink-0 ${isRTL ? 'border-l' : 'border-r'}`}>
          <ThemeSwitcher />
          <FontSelector />
          <AIPlayerSearch onPlayerSelect={handlePlayerSelect} />
          <BackgroundEditor />
          
          {/* Data Table Button */}
          <button
            onClick={() => setShowDataTable(true)}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 rounded-lg transition-colors text-sm text-neutral-200"
            aria-label="Open data table editor"
          >
            <Table className="w-4 h-4 text-amber-400" />
            Open Data Table
          </button>
          
          <ExportControls canvasRef={canvasRef} />
        </aside>

        {/* Main Canvas */}
        <div className="flex-1 flex items-center justify-center p-8" onClick={handleCanvasClick}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={ALLOWED_FILE_TYPES.join(',')}
            className="hidden"
            aria-label="Upload player image"
          />
          
          {/* Canvas */}
          <div 
            ref={canvasRef}
            className={`theme-${colorTheme} relative overflow-hidden shadow-2xl`}
            style={{
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
              ...backgroundStyle
            }}
            role="application"
            aria-label="Player stats design canvas"
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
              removeBackgroundEnabled={removeBackgroundEnabled}
              onToggleRemoveBackground={() => setRemoveBackgroundEnabled(!removeBackgroundEnabled)}
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
          <aside className={`w-72 p-4 bg-neutral-900/80 border-neutral-800 ${isRTL ? 'border-r' : 'border-l'}`}>
            <PropertyEditor
              component={getSelectedComponentData()}
              onUpdate={handleUpdateComponent}
              onDelete={handleDeleteComponent}
              onClose={() => setSelectedComponent(null)}
              onBringToFront={handleBringToFront}
              onSendToBack={handleSendToBack}
            />
          </aside>
        )}
      </div>

      {/* Data Table Modal */}
      {showDataTable && (
        <DataTable 
          onDataChange={handleDataTableChange}
          onClose={() => setShowDataTable(false)}
        />
      )}
    </div>
  );
};
