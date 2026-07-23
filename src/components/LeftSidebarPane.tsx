import React, { useRef } from 'react';
import { List, AlignLeft, Compass, GitCommit } from 'lucide-react';
import { tokens } from '../design-system/tokens';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface LeftSidebarPaneProps {
  width: number;
  onWidthChange: (newWidth: number) => void;
  isDiffOpen?: boolean;
  tocItems?: TocItem[];
  activeHeadingId?: string;
  onSelectHeading?: (id: string) => void;
}

export const LeftSidebarPane: React.FC<LeftSidebarPaneProps> = ({
  width,
  onWidthChange,
  isDiffOpen = false,
  tocItems,
  activeHeadingId = 'some-header-text',
  onSelectHeading,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Default Document TOC items vs Changed Sections Diff items
  const defaultDocToc: TocItem[] = [
    { id: 'some-header-text', text: 'System Architecture & Lore Contracts', level: 1 },
    { id: '1-core-architecture-flow', text: '1. Core Architecture Flow', level: 2 },
    { id: '2-backend-api-contracts--endpoints', text: '2. Backend API Contracts & Endpoints', level: 2 },
    { id: '3-subtype-matrix--governance', text: '3. Subtype Matrix & Governance', level: 2 },
    { id: '4-key-roadmap-tasks--checklists', text: '4. Key Roadmap Tasks & Checklists', level: 2 },
  ];

  const defaultDiffSections: TocItem[] = [
    { id: 'diff-chunk-1', text: '§ 1. Architectural Paradigm', level: 1 },
    { id: 'diff-chunk-2', text: '§ 2. Mermaid Sequence Diagram', level: 1 },
    { id: 'diff-chunk-3', text: '§ 3. Python Router API', level: 1 },
    { id: 'diff-chunk-4', text: '§ 4. Subtype Matrix Table', level: 1 },
  ];

  const currentItems = tocItems || (isDiffOpen ? defaultDiffSections : defaultDocToc);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
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
      {/* Sidebar Header: Switches dynamically between "Table of Contents" and "Changed Sections" */}
      <div style={styles.header}>
        {isDiffOpen ? (
          <>
            <GitCommit size={15} style={{ color: '#38bdf8', marginRight: '8px' }} />
            <span style={{ ...styles.headerTitle, color: '#38bdf8' }}>Changed Sections</span>
          </>
        ) : (
          <>
            <List size={15} style={{ color: tokens.colors.textSecondary, marginRight: '8px' }} />
            <span style={styles.headerTitle}>Table of Contents</span>
          </>
        )}
      </div>

      {/* TOC Outline Tree / Changed Sections list */}
      <div style={styles.tocList}>
        {currentItems.map((item) => {
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
                color: isDiffOpen ? '#D4D4D4' : isActive ? '#ffffff' : tokens.colors.textSecondary,
                fontWeight: isActive ? '600' : '400',
              }}
              title={item.text}
            >
              {isDiffOpen ? (
                <Compass
                  size={13}
                  style={{
                    marginRight: '8px',
                    color: '#38bdf8',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <AlignLeft
                  size={13}
                  style={{
                    marginRight: '8px',
                    opacity: isActive ? 1 : 0.5,
                    color: isActive ? tokens.colors.accentPrimary : tokens.colors.textDim,
                    flexShrink: 0,
                  }}
                />
              )}
              <span style={styles.tocText}>{item.text}</span>
            </div>
          );
        })}
      </div>

      {/* Drag-to-Resize Right Border Handle */}
      <div
        onMouseDown={handleMouseDown}
        style={styles.resizeHandle}
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
    backgroundColor: 'transparent',
  },
};
