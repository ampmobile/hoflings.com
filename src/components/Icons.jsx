import React from 'react';

const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const Icon = ({ name, ...rest }) => {
  const p = { ...s, ...rest };
  switch (name) {
    case 'arrow':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case 'search':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.6-3.6" />
        </svg>
      );
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M11 18.5h2" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <rect x="3" y="5" width="18" height="16" rx="2.5" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <circle cx="9" cy="8" r="3.4" />
          <path d="M2.5 20a6.5 6.5 0 0113 0" />
          <path d="M16 5.2a3.4 3.4 0 010 5.6M18 20a6.4 6.4 0 00-2-4.5" />
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-5 3 3 5-7" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 24 24" {...p} strokeWidth={3}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case 'pin':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
          <circle cx="12" cy="10" r="2.6" />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 21.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
        </svg>
      );
    case 'layers':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M12 3l9 5-9 5-9-5 9-5z" />
          <path d="M3 13l9 5 9-5" />
        </svg>
      );
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
          <circle cx="12" cy="12" r="3.4" />
        </svg>
      );
    case 'file':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      );
    case 'truck':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z" />
          <circle cx="7" cy="18" r="1.8" />
          <circle cx="17" cy="18" r="1.8" />
        </svg>
      );
    case 'lock':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <rect x="4" y="10" width="16" height="11" rx="2.5" />
          <path d="M8 10V7a4 4 0 118 0v3" />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </svg>
      );
    case 'moon':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M20.5 14.6A8.6 8.6 0 019.4 3.5a8.6 8.6 0 1011.1 11.1z" />
        </svg>
      );
    default:
      return null;
  }
};

export const LogoMark = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l5-9 4 5 3-4 6 8" />
    <circle cx="3" cy="17" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
