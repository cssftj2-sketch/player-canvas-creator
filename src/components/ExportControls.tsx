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
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-heading text-foreground flex items-center gap-2">
        <Download className="w-4 h-4 text-primary" />
        {t('export.title')}
      </h3>

      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={handleExportPNG}
          disabled={isExporting !== null}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
        >
          {isExporting === 'png' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileImage className="w-4 h-4" />
          )}
          {t('export.png')}
        </button>

        <button
          onClick={handleExportJPG}
          disabled={isExporting !== null}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg transition-colors disabled:opacity-50"
        >
          {isExporting === 'jpg' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileImage className="w-4 h-4" />
          )}
          {t('export.jpg')}
        </button>

        <button
          onClick={handleExportPDF}
          disabled={isExporting !== null}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border hover:bg-muted text-foreground rounded-lg transition-colors disabled:opacity-50"
        >
          {isExporting === 'pdf' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          {t('export.pdf')}
        </button>
      </div>
    </div>
  );
};
