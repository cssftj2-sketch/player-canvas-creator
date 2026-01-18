import React from 'react';

interface CanvasOverlaysProps {
  variant: 'none' | 'vignette' | 'grid' | 'noise' | 'gradient-frame' | 'spotlight';
  primaryColor?: string;
  secondaryColor?: string;
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = ({
  variant,
  primaryColor = 'var(--theme-primary)',
  secondaryColor = 'var(--theme-secondary)',
}) => {
  if (variant === 'none') return null;

  const renderOverlay = () => {
    switch (variant) {
      case 'vignette':
        return (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
            }}
          />
        );
      
      case 'grid':
        return (
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        );
      
      case 'noise':
        return (
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        );
      
      case 'gradient-frame':
        return (
          <>
            {/* Top glow */}
            <div 
              className="absolute top-0 left-0 right-0 h-2 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}60, transparent)`,
              }}
            />
            {/* Bottom glow */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none"
              style={{
                background: `linear-gradient(to top, ${secondaryColor}60, transparent)`,
              }}
            />
            {/* Left accent */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-1 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
              }}
            />
            {/* Right accent */}
            <div 
              className="absolute top-0 bottom-0 right-0 w-1 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, ${secondaryColor}, ${primaryColor})`,
              }}
            />
          </>
        );
      
      case 'spotlight':
        return (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 30% 20%, ${primaryColor}15, transparent 50%), 
                           radial-gradient(ellipse 60% 80% at 70% 80%, ${secondaryColor}10, transparent 50%)`,
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return <>{renderOverlay()}</>;
};
