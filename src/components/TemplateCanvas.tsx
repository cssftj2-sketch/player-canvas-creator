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
import { useTheme, fontCombinations } from '@/contexts/ThemeContext';
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
  textColor?: string;
  numberColor?: string;
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
  charts: ChartState[];
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
    customColor?: string;
    textColor?: string;
    numberColor?: string;
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
  charts: [{
    id: 'chart1',
    data: [
      { value: 2 }, { value: -3 }, { value: 5 }, { value: 8 }, 
      { value: -2 }, { value: 6 }, { value: 4 }, { value: -5 },
      { value: 7 }, { value: 3 }, { value: -1 }, { value: 4 },
    ],
    title: 'MATCH PERFORMANCE',
    position: { x: 480, y: 520 },
    zIndex: 10
  }],
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

// Component configuration - maps ALL possible toolbar button IDs
const COMPONENT_CONFIGS: Record<string, { type: keyof TemplateState; defaults: any }> = {
  // Circles - all possible variants
  'circle-lg': { type: 'circles', defaults: { value: '0%', label: 'New Stat', color: 'gold', size: 'lg' } },
  'circle-md': { type: 'circles', defaults: { value: '0%', label: 'New Stat', color: 'emerald', size: 'md' } },
  'circle-sm': { type: 'circles', defaults: { value: '0%', label: 'New Stat', color: 'gold', size: 'sm' } },
  'stat-circle': { type: 'circles', defaults: { value: '0%', label: 'New Stat', color: 'gold', size: 'md' } },
  'circle': { type: 'circles', defaults: { value: '0%', label: 'New Stat', color: 'gold', size: 'md' } },
  'circle-stat': { type: 'circles', defaults: { value: '0%', label: 'New Stat', color: 'gold', size: 'md' } },
  
  // Boxes - all possible variants
  'stat-box': { type: 'boxes', defaults: { value: '0', label: 'NEW' } },
  'box-shape': { type: 'boxes', defaults: { value: '0', label: 'BOX' } },
  'box': { type: 'boxes', defaults: { value: '0', label: 'BOX' } },
  'square-box': { type: 'boxes', defaults: { value: '0', label: 'BOX' } },
  
  // Mini Stats - all possible variants
  'mini-stat': { type: 'miniStats', defaults: { value: '0', label: 'STAT', sublabel: 'label' } },
  'mini-box': { type: 'miniStats', defaults: { value: '0', label: 'STAT', sublabel: 'label' } },
  'small-stat': { type: 'miniStats', defaults: { value: '0', label: 'STAT', sublabel: 'label' } },
  
  // Progress Bars - all possible variants
  'progress-bar': { type: 'progressBars', defaults: { value: 75, label: 'Progress', color: 'gold', size: { width: 200, height: 40 } } },
  'progress': { type: 'progressBars', defaults: { value: 75, label: 'Progress', color: 'gold', size: { width: 200, height: 40 } } },
  'bar': { type: 'progressBars', defaults: { value: 75, label: 'Progress', color: 'gold', size: { width: 200, height: 40 } } },
  
  // Dividers - all possible variants
  'divider-h': { type: 'dividers', defaults: { orientation: 'horizontal', color: 'gold', size: { width: 150, height: 4 } } },
  'divider-v': { type: 'dividers', defaults: { orientation: 'vertical', color: 'gold', size: { width: 4, height: 100 } } },
  'divider': { type: 'dividers', defaults: { orientation: 'horizontal', color: 'gold', size: { width: 150, height: 4 } } },
  'line-h': { type: 'dividers', defaults: { orientation: 'horizontal', color: 'gold', size: { width: 150, height: 4 } } },
  'line-v': { type: 'dividers', defaults: { orientation: 'vertical', color: 'gold', size: { width: 4, height: 100 } } },
  'separator': { type: 'dividers', defaults: { orientation: 'horizontal', color: 'gold', size: { width: 150, height: 4 } } },
  
  // Text Labels - all possible variants
  'text-label': { type: 'textLabels', defaults: { text: 'Label', fontSize: 24, fontWeight: 'bold', color: 'gold' } },
  'text': { type: 'textLabels', defaults: { text: 'Text', fontSize: 20, fontWeight: 'normal', color: 'gold' } },
  'label': { type: 'textLabels', defaults: { text: 'Label', fontSize: 20, fontWeight: 'normal', color: 'gold' } },
  'heading': { type: 'textLabels', defaults: { text: 'Heading', fontSize: 32, fontWeight: 'bold', color: 'gold' } },
  
  // Chart - now supports multiple instances
  'line-chart': { type: 'charts', defaults: { data: [{ value: 2 }, { value: -3 }, { value: 5 }, { value: 8 }, { value: -2 }, { value: 6 }, { value: 4 }, { value: -5 }, { value: 7 }, { value: 3 }, { value: -1 }, { value: 4 }], title: 'PERFORMANCE' } },
  'chart': { type: 'charts', defaults: { data: [{ value: 2 }, { value: -3 }, { value: 5 }, { value: 8 }, { value: -2 }, { value: 6 }, { value: 4 }, { value: -5 }, { value: 7 }, { value: 3 }, { value: -1 }, { value: 4 }], title: 'PERFORMANCE' } },
  'performance-chart': { type: 'charts', defaults: { data: [{ value: 2 }, { value: -3 }, { value: 5 }, { value: 8 }, { value: -2 }, { value: 6 }, { value: 4 }, { value: -5 }, { value: 7 }, { value: 3 }, { value: -1 }, { value: 4 }], title: 'PERFORMANCE' } },
  'activity-chart': { type: 'charts', defaults: { data: [{ value: 2 }, { value: -3 }, { value: 5 }, { value: 8 }, { value: -2 }, { value: 6 }, { value: 4 }, { value: -5 }, { value: 7 }, { value: 3 }, { value: -1 }, { value: 4 }], title: 'ACTIVITY' } },
  'bar-chart': { type: 'charts', defaults: { data: [{ value: 2 }, { value: -3 }, { value: 5 }, { value: 8 }, { value: -2 }, { value: 6 }, { value: 4 }, { value: -5 }, { value: 7 }, { value: 3 }, { value: -1 }, { value: 4 }], title: 'TREND' } },
};

export const TemplateCanvas = React.forwardRef<HTMLDivElement>((props, ref) => {
  const { t, isRTL, canvasBackground, colorTheme, fontCombination } = useTheme();
  const [state, setState] = useState<TemplateState>(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [removeBackgroundEnabled, setRemoveBackgroundEnabled] = useState(true);
  const [showDataTable, setShowDataTable] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(20);
  const [zoomLevel, setZoomLevel] = useState(1);
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
      ...state.charts.map(c => c.zIndex || 0),
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
    // Need to call setState directly to update zIndex
    setState(prev => {
      const updateZIndex = (items: any[], id: string) => 
        items.map(item => item.id === id ? { ...item, zIndex: newZ } : item);
      
      if (prev.circles.find(c => c.id === selectedComponent)) {
        return { ...prev, circles: updateZIndex(prev.circles, selectedComponent) };
      }
      if (prev.boxes.find(b => b.id === selectedComponent)) {
        return { ...prev, boxes: updateZIndex(prev.boxes, selectedComponent) };
      }
      if (prev.miniStats.find(m => m.id === selectedComponent)) {
        return { ...prev, miniStats: updateZIndex(prev.miniStats, selectedComponent) };
      }
      if (prev.charts.find(c => c.id === selectedComponent)) {
        return { ...prev, charts: updateZIndex(prev.charts, selectedComponent) };
      }
      if (prev.progressBars.find(p => p.id === selectedComponent)) {
        return { ...prev, progressBars: updateZIndex(prev.progressBars, selectedComponent) };
      }
      if (prev.dividers.find(d => d.id === selectedComponent)) {
        return { ...prev, dividers: updateZIndex(prev.dividers, selectedComponent) };
      }
      if (prev.iconBadges.find(i => i.id === selectedComponent)) {
        return { ...prev, iconBadges: updateZIndex(prev.iconBadges, selectedComponent) };
      }
      if (prev.textLabels.find(t => t.id === selectedComponent)) {
        return { ...prev, textLabels: updateZIndex(prev.textLabels, selectedComponent) };
      }
      if (selectedComponent === 'playerName') {
        return { ...prev, playerName: { ...prev.playerName, zIndex: newZ } };
      }
      if (selectedComponent === 'playerImage') {
        return { ...prev, playerImage: { ...prev.playerImage, zIndex: newZ } };
      }
      if (selectedComponent === 'header') {
        return { ...prev, header: { ...prev.header, zIndex: newZ } };
      }
      if (selectedComponent === 'rating') {
        return { ...prev, rating: { ...prev.rating, zIndex: newZ } };
      }
      return prev;
    });
    console.log('Brought to front with zIndex:', newZ);
  }, [selectedComponent, maxZIndex]);

  const handleSendToBack = useCallback(() => {
    if (!selectedComponent) return;
    const newZ = 1;
    setState(prev => {
      const updateZIndex = (items: any[], id: string) => 
        items.map(item => item.id === id ? { ...item, zIndex: newZ } : item);
      
      if (prev.circles.find(c => c.id === selectedComponent)) {
        return { ...prev, circles: updateZIndex(prev.circles, selectedComponent) };
      }
      if (prev.boxes.find(b => b.id === selectedComponent)) {
        return { ...prev, boxes: updateZIndex(prev.boxes, selectedComponent) };
      }
      if (prev.miniStats.find(m => m.id === selectedComponent)) {
        return { ...prev, miniStats: updateZIndex(prev.miniStats, selectedComponent) };
      }
      if (prev.charts.find(c => c.id === selectedComponent)) {
        return { ...prev, charts: updateZIndex(prev.charts, selectedComponent) };
      }
      if (prev.progressBars.find(p => p.id === selectedComponent)) {
        return { ...prev, progressBars: updateZIndex(prev.progressBars, selectedComponent) };
      }
      if (prev.dividers.find(d => d.id === selectedComponent)) {
        return { ...prev, dividers: updateZIndex(prev.dividers, selectedComponent) };
      }
      if (prev.iconBadges.find(i => i.id === selectedComponent)) {
        return { ...prev, iconBadges: updateZIndex(prev.iconBadges, selectedComponent) };
      }
      if (prev.textLabels.find(t => t.id === selectedComponent)) {
        return { ...prev, textLabels: updateZIndex(prev.textLabels, selectedComponent) };
      }
      if (selectedComponent === 'playerName') {
        return { ...prev, playerName: { ...prev.playerName, zIndex: newZ } };
      }
      if (selectedComponent === 'playerImage') {
        return { ...prev, playerImage: { ...prev.playerImage, zIndex: newZ } };
      }
      if (selectedComponent === 'header') {
        return { ...prev, header: { ...prev.header, zIndex: newZ } };
      }
      if (selectedComponent === 'rating') {
        return { ...prev, rating: { ...prev.rating, zIndex: newZ } };
      }
      return prev;
    });
    console.log('Sent to back with zIndex:', newZ);
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
      
      console.log('Player data loaded successfully');
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
        canDelete: true,
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
        canDelete: true,
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
        canDelete: true,
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
        canDelete: true,
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
        canDelete: true,
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
        canDelete: true,
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
        canDelete: true,
      };
    }

    const chart = state.charts.find(c => c.id === selectedComponent);
    if (chart) {
      return {
        id: chart.id,
        type: 'chart',
        label: chart.title,
        customColor: chart.customColor,
        textColor: chart.textColor,
        numberColor: chart.numberColor,
        zIndex: chart.zIndex,
        canDelete: true,
      };
    }

    if (selectedComponent === 'rating') {
      return {
        id: 'rating',
        type: 'rating',
        value: state.rating.value,
        label: state.rating.label,
        customColor: state.rating.customColor,
        textColor: state.rating.textColor,
        numberColor: state.rating.numberColor,
        zIndex: state.rating.zIndex,
        canDelete: false,
      };
    }

    if (selectedComponent === 'playerName') {
      return {
        id: 'playerName',
        type: 'playerName',
        value: `${state.playerName.firstName} ${state.playerName.lastName}`,
        label: state.playerName.country,
        zIndex: state.playerName.zIndex,
        canDelete: false,
      };
    }

    if (selectedComponent === 'header') {
      return {
        id: 'header',
        type: 'header',
        value: state.header.title,
        label: state.header.subtitle,
        zIndex: state.header.zIndex,
        canDelete: false,
      };
    }

    if (selectedComponent === 'playerImage') {
      return {
        id: 'playerImage',
        type: 'playerImage',
        value: state.playerImage.imageUrl || '',
        zIndex: state.playerImage.zIndex,
        canDelete: false,
      };
    }

    return null;
  }, [selectedComponent, state]);

  const handleUpdateComponent = useCallback((data: Partial<ComponentData>) => {
    if (!selectedComponent) return;

    console.log('Updating component:', selectedComponent, 'with data:', data);

    setState(prev => {
      // Handle playerName
      if (selectedComponent === 'playerName') {
        const updated = { ...prev.playerName, ...data };
        console.log('Updated playerName:', updated);
        return { ...prev, playerName: updated };
      }

      // Handle header
      if (selectedComponent === 'header') {
        const updated = { 
          ...prev.header, 
          title: data.value !== undefined ? data.value : prev.header.title,
          subtitle: data.label !== undefined ? data.label : prev.header.subtitle,
          ...data 
        };
        console.log('Updated header:', updated);
        return { ...prev, header: updated };
      }

      // Handle playerImage
      if (selectedComponent === 'playerImage') {
        const updated = { 
          ...prev.playerImage, 
          zIndex: data.zIndex !== undefined ? data.zIndex : prev.playerImage.zIndex,
        };
        console.log('Updated playerImage:', updated);
        return { ...prev, playerImage: updated };
      }

      // Handle circles
      const circleIdx = prev.circles.findIndex(c => c.id === selectedComponent);
      if (circleIdx !== -1) {
        const updated = [...prev.circles];
        const oldCircle = updated[circleIdx];
        updated[circleIdx] = { 
          ...oldCircle,
          value: data.value !== undefined ? data.value : oldCircle.value,
          label: data.label !== undefined ? data.label : oldCircle.label,
          color: data.color !== undefined ? data.color : oldCircle.color,
          customColor: data.customColor !== undefined ? data.customColor : oldCircle.customColor,
          textColor: data.textColor !== undefined ? data.textColor : oldCircle.textColor,
          numberColor: data.numberColor !== undefined ? data.numberColor : oldCircle.numberColor,
          size: data.size !== undefined ? data.size : oldCircle.size,
          zIndex: data.zIndex !== undefined ? data.zIndex : oldCircle.zIndex,
        };
        console.log('Updated circle:', updated[circleIdx]);
        return { ...prev, circles: updated };
      }

      // Handle boxes
      const boxIdx = prev.boxes.findIndex(b => b.id === selectedComponent);
      if (boxIdx !== -1) {
        const updated = [...prev.boxes];
        const oldBox = updated[boxIdx];
        updated[boxIdx] = { 
          ...oldBox,
          value: data.value !== undefined ? data.value : oldBox.value,
          label: data.label !== undefined ? data.label : oldBox.label,
          customColor: data.customColor !== undefined ? data.customColor : oldBox.customColor,
          textColor: data.textColor !== undefined ? data.textColor : oldBox.textColor,
          numberColor: data.numberColor !== undefined ? data.numberColor : oldBox.numberColor,
          zIndex: data.zIndex !== undefined ? data.zIndex : oldBox.zIndex,
        };
        console.log('Updated box:', updated[boxIdx]);
        return { ...prev, boxes: updated };
      }

      // Handle miniStats
      const miniIdx = prev.miniStats.findIndex(m => m.id === selectedComponent);
      if (miniIdx !== -1) {
        const updated = [...prev.miniStats];
        const oldMini = updated[miniIdx];
        updated[miniIdx] = { 
          ...oldMini,
          value: data.value !== undefined ? data.value : oldMini.value,
          label: data.label !== undefined ? data.label : oldMini.label,
          sublabel: data.sublabel !== undefined ? data.sublabel : oldMini.sublabel,
          customColor: data.customColor !== undefined ? data.customColor : oldMini.customColor,
          textColor: data.textColor !== undefined ? data.textColor : oldMini.textColor,
          numberColor: data.numberColor !== undefined ? data.numberColor : oldMini.numberColor,
          zIndex: data.zIndex !== undefined ? data.zIndex : oldMini.zIndex,
        };
        console.log('Updated miniStat:', updated[miniIdx]);
        return { ...prev, miniStats: updated };
      }

      // Handle progressBars
      const barIdx = prev.progressBars.findIndex(p => p.id === selectedComponent);
      if (barIdx !== -1) {
        const updated = [...prev.progressBars];
        const oldBar = updated[barIdx];
        const numValue = data.value !== undefined ? parseInt(data.value.toString(), 10) : oldBar.value;
        const validValue = isNaN(numValue) ? 0 : Math.max(0, Math.min(100, numValue));
        updated[barIdx] = { 
          ...oldBar,
          value: validValue,
          label: data.label !== undefined ? data.label : oldBar.label,
          color: data.color !== undefined ? data.color : oldBar.color,
          customColor: data.customColor !== undefined ? data.customColor : oldBar.customColor,
          zIndex: data.zIndex !== undefined ? data.zIndex : oldBar.zIndex,
        };
        console.log('Updated progressBar:', updated[barIdx]);
        return { ...prev, progressBars: updated };
      }

      // Handle dividers
      const dividerIdx = prev.dividers.findIndex(d => d.id === selectedComponent);
      if (dividerIdx !== -1) {
        const updated = [...prev.dividers];
        const oldDivider = updated[dividerIdx];
        updated[dividerIdx] = { 
          ...oldDivider,
          color: data.color !== undefined ? data.color : oldDivider.color,
          customColor: data.customColor !== undefined ? data.customColor : oldDivider.customColor,
          orientation: data.orientation !== undefined ? data.orientation : oldDivider.orientation,
          zIndex: data.zIndex !== undefined ? data.zIndex : oldDivider.zIndex,
        };
        console.log('Updated divider:', updated[dividerIdx]);
        return { ...prev, dividers: updated };
      }

      // Handle iconBadges
      const iconIdx = prev.iconBadges.findIndex(i => i.id === selectedComponent);
      if (iconIdx !== -1) {
        const updated = [...prev.iconBadges];
        const oldIcon = updated[iconIdx];
        updated[iconIdx] = { 
          ...oldIcon,
          color: data.color !== undefined ? data.color : oldIcon.color,
          customColor: data.customColor !== undefined ? data.customColor : oldIcon.customColor,
          size: data.size !== undefined ? data.size : oldIcon.size,
          zIndex: data.zIndex !== undefined ? data.zIndex : oldIcon.zIndex,
        };
        console.log('Updated icon:', updated[iconIdx]);
        return { ...prev, iconBadges: updated };
      }

      // Handle textLabels
      const textIdx = prev.textLabels.findIndex(t => t.id === selectedComponent);
      if (textIdx !== -1) {
        const updated = [...prev.textLabels];
        const oldText = updated[textIdx];
        updated[textIdx] = { 
          ...oldText,
          text: data.value !== undefined ? data.value : oldText.text,
          fontSize: data.fontSize !== undefined ? data.fontSize : oldText.fontSize,
          fontWeight: data.fontWeight !== undefined ? data.fontWeight : oldText.fontWeight,
          color: data.color !== undefined ? data.color : oldText.color,
          customColor: data.customColor !== undefined ? data.customColor : oldText.customColor,
          zIndex: data.zIndex !== undefined ? data.zIndex : oldText.zIndex,
        };
        console.log('Updated text:', updated[textIdx]);
        return { ...prev, textLabels: updated };
      }

      // Handle charts
      const chartIdx = prev.charts.findIndex(c => c.id === selectedComponent);
      if (chartIdx !== -1) {
        const updated = [...prev.charts];
        const oldChart = updated[chartIdx];
        updated[chartIdx] = { 
          ...oldChart,
          title: data.label !== undefined ? data.label : oldChart.title,
          customColor: data.customColor !== undefined ? data.customColor : oldChart.customColor,
          textColor: data.textColor !== undefined ? data.textColor : oldChart.textColor,
          numberColor: data.numberColor !== undefined ? data.numberColor : oldChart.numberColor,
          zIndex: data.zIndex !== undefined ? data.zIndex : oldChart.zIndex,
        };
        console.log('Updated chart:', updated[chartIdx]);
        return { ...prev, charts: updated };
      }

      // Handle rating
      if (selectedComponent === 'rating') {
        const updated = { 
          ...prev.rating, 
          value: data.value !== undefined ? data.value : prev.rating.value,
          label: data.label !== undefined ? data.label : prev.rating.label,
          customColor: data.customColor !== undefined ? data.customColor : prev.rating.customColor,
          textColor: data.textColor !== undefined ? data.textColor : prev.rating.textColor,
          numberColor: data.numberColor !== undefined ? data.numberColor : prev.rating.numberColor,
          zIndex: data.zIndex !== undefined ? data.zIndex : prev.rating.zIndex,
        };
        console.log('Updated rating:', updated);
        return { ...prev, rating: updated };
      }

      console.log('Component not found:', selectedComponent);
      return prev;
    });
  }, [selectedComponent]);

  const handleDeleteComponent = useCallback(() => {
    if (!selectedComponent) return;

    // Prevent deletion of unique components
    const nonDeletableComponents = ['playerName', 'header', 'rating', 'playerImage'];
    if (nonDeletableComponents.includes(selectedComponent)) {
      console.log('Cannot delete this component - it is a unique element');
      return;
    }

    setState(prev => ({
      ...prev,
      circles: prev.circles.filter(c => c.id !== selectedComponent),
      boxes: prev.boxes.filter(b => b.id !== selectedComponent),
      miniStats: prev.miniStats.filter(m => m.id !== selectedComponent),
      progressBars: prev.progressBars.filter(p => p.id !== selectedComponent),
      dividers: prev.dividers.filter(d => d.id !== selectedComponent),
      iconBadges: prev.iconBadges.filter(i => i.id !== selectedComponent),
      textLabels: prev.textLabels.filter(t => t.id !== selectedComponent),
      charts: prev.charts.filter(c => c.id !== selectedComponent),
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
  }, []);

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

    // Handle special single components (can't be duplicated)
    const singleComponents = ['player-name', 'header', 'chart', 'line-chart', 'rating', 'player-image'];
    if (singleComponents.includes(componentId)) {
      console.log(`${componentId} already exists - cannot add duplicate`);
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
    const config = COMPONENT_CONFIGS[componentId];
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
      console.log('Unknown component ID:', componentId);
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

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Zoom Controls */}
          <div className="flex items-center justify-center gap-2 py-2 bg-neutral-900/50 border-b border-neutral-800">
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-sm"
            >
              −
            </button>
            <span className="text-neutral-300 text-sm min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-sm"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded text-sm ml-2"
            >
              Reset
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto" onClick={handleCanvasClick}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={ALLOWED_FILE_TYPES.join(',')}
              className="hidden"
              aria-label="Upload player image"
            />
            
            {/* Canvas - Theme and Font applied only here */}
            <div 
              ref={canvasRef}
              className={`relative overflow-hidden theme-${colorTheme}`}
              key={`canvas-${colorTheme}-${fontCombination}`}
              style={{
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                ...backgroundStyle,
              }}
              role="application"
              aria-label="Player stats design canvas"
            >
              {/* Font style wrapper - applies font CSS vars only to canvas content */}
              <style>{`
                [data-canvas-fonts] {
                  --font-display: ${fontCombinations[fontCombination].display};
                  --font-heading: ${fontCombinations[fontCombination].heading};
                  --font-body: ${fontCombinations[fontCombination].body};
                }
                [data-canvas-fonts] .font-display { font-family: var(--font-display); }
                [data-canvas-fonts] .font-heading { font-family: var(--font-heading); }
              `}</style>
              <div data-canvas-fonts className="absolute inset-0">

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
                key={`${circle.id}-${colorTheme}`}
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
                key={`${box.id}-${colorTheme}`}
                {...box}
                onPositionChange={(id, pos) => updatePosition('boxes', id, pos)}
                onValueChange={handleBoxValueChange}
                onSelect={handleSelectComponent}
                isSelected={selectedComponent === box.id}
              />
            ))}

            {/* Player Name */}
            <PlayerName
              key={`playerName-${colorTheme}`}
              {...state.playerName}
              onPositionChange={(id, pos) => updatePosition('playerName', id, pos)}
              onValueChange={handlePlayerNameChange}
              onSelect={handleSelectComponent}
              isSelected={selectedComponent === state.playerName.id}
            />

            {/* Performance Charts */}
            {state.charts.map(chart => (
              <PerformanceChart
                key={`${chart.id}-${colorTheme}`}
                {...chart}
                customColor={chart.customColor}
                textColor={chart.textColor}
                numberColor={chart.numberColor}
                onPositionChange={(id, pos) => updatePosition('charts', id, pos)}
                onSelect={handleSelectComponent}
                isSelected={selectedComponent === chart.id}
              />
            ))}

            {/* Mini Stats */}
            {state.miniStats.map(stat => (
              <MiniStatBox
                key={`${stat.id}-${colorTheme}`}
                {...stat}
                onPositionChange={(id, pos) => updatePosition('miniStats', id, pos)}
                onValueChange={handleMiniStatValueChange}
                onSelect={handleSelectComponent}
                isSelected={selectedComponent === stat.id}
              />
            ))}

            {/* Rating Badge */}
            <RatingBadge
              key={`rating-${colorTheme}`}
              {...state.rating}
              onPositionChange={(id, pos) => updatePosition('rating', id, pos)}
              onValueChange={handleRatingChange}
              onSelect={handleSelectComponent}
              isSelected={selectedComponent === state.rating.id}
            />

            {/* Progress Bars */}
            {state.progressBars.map(bar => (
              <ProgressBar
                key={`${bar.id}-${colorTheme}`}
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
                key={`${divider.id}-${colorTheme}`}
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
                key={`${icon.id}-${colorTheme}`}
                {...icon}
                onPositionChange={(id, pos) => updatePosition('iconBadges', id, pos)}
                onSelect={handleSelectComponent}
                isSelected={selectedComponent === icon.id}
              />
            ))}

            {/* Text Labels */}
            {state.textLabels.map(text => (
              <TextLabel
                key={`${text.id}-${colorTheme}`}
                {...text}
                onPositionChange={(id, pos) => updatePosition('textLabels', id, pos)}
                onValueChange={handleTextLabelChange}
                onSelect={handleSelectComponent}
                isSelected={selectedComponent === text.id}
              />
            ))}
            </div>
            </div>
          </div>
        </div>
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
});

TemplateCanvas.displayName = 'TemplateCanvas';
