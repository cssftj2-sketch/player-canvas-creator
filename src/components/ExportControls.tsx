import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Download, FileImage, FileText, Loader2 } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface ExportControlsProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ canvasRef }) => {
  const { t } = useTheme();
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const getCanvasElement = () => {
    if (!canvasRef.current) {
      toast.error('Canvas not found');
      return null;
    }
    return canvasRef.current;
  };

  const handleExportPNG = async () => {
    const canvas = getCanvasElement();
    if (!canvas) return;

    setIsExporting('png');
    try {
      const dataUrl = await toPng(canvas, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000000',
      });
      
      const link = document.createElement('a');
      link.download = `player-stats-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('PNG exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export PNG');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportJPG = async () => {
    const canvas = getCanvasElement();
    if (!canvas) return;

    setIsExporting('jpg');
    try {
      const dataUrl = await toJpeg(canvas, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#000000',
      });
      
      const link = document.createElement('a');
      link.download = `player-stats-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
      toast.success('JPG exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export JPG');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPDF = async () => {
    const canvas = getCanvasElement();
    if (!canvas) return;

    setIsExporting('pdf');
    try {
      const dataUrl = await toPng(canvas, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000000',
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [750, 850],
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, 750, 850);
      pdf.save(`player-stats-${Date.now()}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 space-y-2">
      <h3 className="text-xs font-medium text-foreground flex items-center gap-1.5">
        <Download className="w-3.5 h-3.5 text-primary" />
        {t('export.title')}
      </h3>

      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={handleExportPNG}
          disabled={isExporting !== null}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors disabled:opacity-50"
        >
          {isExporting === 'png' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileImage className="w-4 h-4" />
          )}
          <span className="text-[10px] font-medium">PNG</span>
        </button>

        <button
          onClick={handleExportJPG}
          disabled={isExporting !== null}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-md transition-colors disabled:opacity-50"
        >
          {isExporting === 'jpg' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileImage className="w-4 h-4" />
          )}
          <span className="text-[10px] font-medium">JPG</span>
        </button>

        <button
          onClick={handleExportPDF}
          disabled={isExporting !== null}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 border border-border hover:bg-muted text-foreground rounded-md transition-colors disabled:opacity-50"
        >
          {isExporting === 'pdf' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span className="text-[10px] font-medium">PDF</span>
        </button>
      </div>
    </div>
  );
};