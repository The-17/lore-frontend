import React, { useState, useRef } from 'react';
import { tokens } from '../design-system/tokens';

interface WikiLinkProps {
  title: string;
  onNavigate?: (title: string) => void;
}

export const WikiLink: React.FC<WikiLinkProps> = ({ title, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const pillRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (pillRef.current) {
      const rect = pillRef.current.getBoundingClientRect();
      const cardWidth = 320;
      const cardHeight = 150;
      
      let left = rect.left + rect.width / 2 - cardWidth / 2;
      left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));

      let top = rect.top - cardHeight - 10;
      if (top < 16) {
        top = rect.bottom + 10;
      }

      setCoords({ top, left });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  // Mock database previews for linked wiki artifacts
  const mockPreviews: Record<string, { snippet: string }> = {
    'Django Ninja Patterns': {
      snippet: 'Standardized API schemas, Ninja router decorators, and error handling contracts for fast REST endpoints.',
    },
    'Agent Token Security': {
      snippet: 'Auth middleware resolving both JWT Bearer tokens and custom agent execution keys safely.',
    },
  };

  const info = mockPreviews[title] || {
    snippet: `Linked architectural artifact containing details on [[${title}]].`,
  };

  return (
    <span
      ref={pillRef}
      style={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Wiki Link Pill */}
      <span
        onClick={() => onNavigate && onNavigate(title)}
        style={styles.pill}
      >
        [{title}]
      </span>

      {/* Fixed Viewport Glassmorphic Hover Preview Card (Matching Reference Mockup 1-to-1) */}
      {isHovered && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            ...styles.hoverCard,
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
        >
          {/* Artifact Title */}
          <div style={styles.cardTitle}>{title}</div>

          {/* Snippet Paragraph */}
          <p style={styles.cardSnippet}>{info.snippet}</p>

          {/* Full-width Solid White View artifact Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onNavigate) onNavigate(title);
            }}
            style={styles.viewArtifactBtn}
          >
            View artifact
          </button>
        </div>
      )}
    </span>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'inline-block',
  },
  pill: {
    color: tokens.colors.wikiLinkText,
    backgroundColor: tokens.colors.wikiLinkBg,
    padding: '2px 7px',
    borderRadius: tokens.radii.sm,
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    userSelect: 'none',
  },
  hoverCard: {
    position: 'fixed',
    width: '320px',
    backgroundColor: '#202022',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    pointerEvents: 'auto',
    fontFamily: tokens.typography.fontFamily,
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: '-0.2px',
  },
  cardSnippet: {
    fontSize: '13px',
    lineHeight: '1.55',
    color: '#a1a1aa',
    margin: 0,
  },
  viewArtifactBtn: {
    width: '100%',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 0',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '6px',
    transition: 'opacity 0.15s ease',
  },
};
