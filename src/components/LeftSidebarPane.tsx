import React, { useState, useRef } from 'react';
import { List, AlignLeft } from 'lucide-react';
import { tokens } from '../design-system/tokens';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface LeftSidebarPaneProps {
  width: number;
  onWidthChange: (newWidth: number) => void;
  tocItems?: TocItem[];
  activeHeadingId?: string;
  onSelectHeading?: (id: string) => void;
}

export const LeftSidebarPane: React.FC<LeftSidebarPaneProps> = ({
  width,
  onWidthChange,
  tocItems = [
    { id: 'some-header-text', text: 'Some header text', level: 1 },
    { id: 'core-system-architecture--lore-contracts', text: 'Core System Architecture & Lore Contracts', level: 2 },
    { id: 'backend-endpoints--api-contract', text: 'Backend Endpoints & API Contract', level: 3 },
    { id: 'lifecycle-states--subtypes', text: 'Lifecycle States & Subtypes', level: 3 },
  ],
  activeHeadingId = 'some-header-text',
  onSelectHeading,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        const newWidth = moveEvent.clientX - rect.left;
        if (
          newWidth >= tokens.layout.minSidebarWidth &&
          newWidth <= tokens.layout.maxSidebarWidth
        ) {
          onWidthChange(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={sidebarRef}
      style={{
        ...styles.container,
        width: `${width}px`,
      }}
    >
      {/* Table of Contents Header */}
      <div style={styles.header}>
        <List size={16} style={{ color: tokens.colors.textSecondary, marginRight: '8px' }} />
        <span style={styles.headerTitle}>Table of Contents</span>
      </div>

      {/* TOC Outline Tree */}
      <div style={styles.tocList}>
        {tocItems.map((item) => {
          const isActive = activeHeadingId === item.id;
          const indent = (item.level - 1) * 14;
          return (
            <div
              key={item.id}
              onClick={() => onSelectHeading && onSelectHeading(item.id)}
              style={{
                ...styles.tocRow,
                paddingLeft: `${12 + indent}px`,
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                color: isActive ? '#ffffff' : tokens.colors.textSecondary,
                fontWeight: isActive ? '600' : '400',
              }}
              title={item.text}
            >
              <AlignLeft
                size={13}
                style={{
                  marginRight: '8px',
                  opacity: isActive ? 1 : 0.5,
                  color: isActive ? tokens.colors.accentPrimary : tokens.colors.textDim,
                  flexShrink: 0,
                }}
              />
              <span style={styles.tocText}>{item.text}</span>
            </div>
          );
        })}
      </div>

      {/* Drag-to-Resize Right Border Handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          ...styles.resizeHandle,
          backgroundColor: isResizing ? tokens.colors.accentPrimary : 'transparent',
        }}
        title="Drag right/left to resize sidebar width"
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    backgroundColor: tokens.colors.bgApp,
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 16px 24px 16px',
    userSelect: 'none',
    flexShrink: 0,
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    paddingLeft: '4px',
  },
  headerTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: tokens.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  tocList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tocRow: {
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingRight: '12px',
    borderRadius: tokens.radii.sm,
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tocText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resizeHandle: {
    position: 'absolute',
    top: 0,
    right: '-5px',
    width: '10px',
    height: '100%',
    cursor: 'col-resize',
    zIndex: 30,
    transition: 'background-color 0.15s ease',
  },
};
