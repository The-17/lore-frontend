import React, { useState, useRef } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { tokens } from '../design-system/tokens';

interface WikiLinkProps {
  title: string;
  onNavigate?: (title: string) => void;
}

export const WikiLink: React.FC<WikiLinkProps> = ({ title, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
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

      {/* Glassmorphic Hover Preview Card */}
      {isHovered && (
        <div style={styles.hoverCard}>
          <div style={styles.cardHeader}>
            <span style={styles.typeBadge}>
              <Sparkles size={11} style={{ marginRight: '4px' }} />
              {info.type}
            </span>
            <span style={styles.cardTitle}>[{title}]</span>
          </div>

          <p style={styles.cardSnippet}>{info.snippet}</p>

          <button
            onClick={() => onNavigate && onNavigate(title)}
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
    position: 'relative',
    display: 'inline-block',
  },
  pill: {
    color: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    padding: '2px 7px',
    borderRadius: '4px',
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    userSelect: 'none',
  },
  hoverCard: {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '280px',
    backgroundColor: 'rgba(28, 28, 32, 0.94)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    padding: '14px',
    boxShadow: tokens.shadows.glass,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
    borderRadius: '10px',
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
  },
  cardSnippet: {
    fontSize: '12px',
    lineHeight: '1.5',
    color: tokens.colors.textSecondary,
    margin: 0,
  },
  goBtn: {
    backgroundColor: tokens.colors.accentPrimary,
    border: 'none',
    color: '#ffffff',
    padding: '6px 12px',
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
