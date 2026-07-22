import React, { useState, useRef } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
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
      // Calculate fixed viewport coordinates: position card above the pill, centered horizontally
      const cardWidth = 280;
      const cardHeight = 130;
      
      let left = rect.left + rect.width / 2 - cardWidth / 2;
      // Keep within left/right viewport edges
      left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));

      // If text is too close to top edge, position card below the pill
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
  const mockPreviews: Record<string, { type: string; snippet: string }> = {
    'Django Ninja Patterns': {
      type: 'Skill',
      snippet: 'Standardized API schemas, Ninja router decorators, and error handling contracts for fast REST endpoints.',
    },
    'Agent Token Security': {
      type: 'Memory',
      snippet: 'Auth middleware resolving both JWT Bearer tokens and custom agent execution keys safely.',
    },
  };

  const info = mockPreviews[title] || {
    type: 'Document',
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

      {/* Fixed Viewport Glassmorphic Hover Preview Card (Renders above all canvas & scroll layers) */}
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
          <div style={styles.cardHeader}>
            <span style={styles.typeBadge}>
              <Sparkles size={11} style={{ marginRight: '4px' }} />
              {info.type}
            </span>
            <span style={styles.cardTitle}>[{title}]</span>
          </div>

          <p style={styles.cardSnippet}>{info.snippet}</p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onNavigate) onNavigate(title);
            }}
            style={styles.goBtn}
          >
            <span>Go to artifact</span>
            <ExternalLink size={12} style={{ marginLeft: '4px' }} />
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
    width: '280px',
    backgroundColor: tokens.colors.bgGlass,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${tokens.colors.borderGlass}`,
    borderRadius: tokens.radii.md,
    padding: '14px',
    boxShadow: tokens.shadows.glass,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'auto',
    fontFamily: tokens.typography.fontFamily,
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  typeBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: '2px 8px',
    borderRadius: tokens.radii.pill,
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  cardSnippet: {
    fontSize: tokens.typography.caption.fontSize,
    lineHeight: tokens.typography.caption.lineHeight,
    color: tokens.colors.textSecondary,
    margin: 0,
  },
  goBtn: {
    backgroundColor: tokens.colors.accentPrimary,
    border: 'none',
    color: '#ffffff',
    padding: '6px 14px',
    borderRadius: tokens.radii.sm,
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: '4px',
  },
};
