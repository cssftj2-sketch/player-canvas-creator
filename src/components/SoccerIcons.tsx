import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const SoccerBall: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2l2.5 4.5L12 10l-2.5-3.5L12 2z" />
    <path d="M22 12l-4.5 2.5L14 12l3.5-2.5L22 12z" />
    <path d="M12 22l-2.5-4.5L12 14l2.5 3.5L12 22z" />
    <path d="M2 12l4.5-2.5L10 12l-3.5 2.5L2 12z" />
    <path d="M6.5 6.5l3.5 2L12 12l-2 3.5-3.5-2z" />
    <path d="M17.5 6.5l-3.5 2L12 12l2 3.5 3.5-2z" />
  </svg>
);

export const Goal: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4v16h16" />
    <path d="M4 4h16v12H4" />
    <path d="M8 4v12" />
    <path d="M12 4v12" />
    <path d="M16 4v12" />
    <path d="M4 8h16" />
    <path d="M4 12h16" />
  </svg>
);

export const Jersey: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2l-4 4v4l3 2v10h14V12l3-2V6l-4-4-4 3h-4L6 2z" />
    <path d="M10 5h4" />
  </svg>
);

export const Whistle: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="12" r="6" />
    <path d="M4 8l6 4-6 4V8z" />
    <line x1="10" y1="12" x2="10" y2="12" />
  </svg>
);

export const Cleat: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 17l3-1 2 2 2-2 2 2 2-2 2 2 2-2 2 2 3-1" />
    <path d="M3 14l2-8c0-2 2-4 5-4h8c2 0 3 1 4 3v9H3z" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="12" cy="7" r="1" />
  </svg>
);

export const Pitch: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="1" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <circle cx="12" cy="12" r="3" />
    <path d="M2 8h3v8H2" />
    <path d="M22 8h-3v8h3" />
  </svg>
);

export const Stopwatch: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="14" r="8" />
    <path d="M12 6V2" />
    <path d="M9 2h6" />
    <path d="M12 14l3-3" />
    <path d="M19 5l2 2" />
  </svg>
);

export const RedCard: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="2" width="16" height="20" rx="2" fill="#DC2626" />
  </svg>
);

export const YellowCard: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="2" width="16" height="20" rx="2" fill="#F59E0B" />
  </svg>
);

export const Formation: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2" />
    <circle cx="6" cy="10" r="2" />
    <circle cx="18" cy="10" r="2" />
    <circle cx="4" cy="18" r="2" />
    <circle cx="12" cy="16" r="2" />
    <circle cx="20" cy="18" r="2" />
    <line x1="12" y1="6" x2="6" y2="8" />
    <line x1="12" y1="6" x2="18" y2="8" />
    <line x1="6" y1="12" x2="4" y2="16" />
    <line x1="18" y1="12" x2="20" y2="16" />
    <line x1="12" y1="14" x2="12" y2="6" />
  </svg>
);

export const GoalNet: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18v12H3V6z" />
    <path d="M3 6l9 6 9-6" />
    <path d="M3 18l9-6 9 6" />
    <path d="M12 6v12" />
  </svg>
);

export const Captain: React.FC<IconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7l5 5 4-8 4 8 5-5-2 13H5L3 7z" />
    <circle cx="12" cy="16" r="2" />
  </svg>
);
