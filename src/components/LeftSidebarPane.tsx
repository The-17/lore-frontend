import React, { useRef } from 'react';
import { List, AlignLeft, GitFork, FileText, Layers, ShieldCheck } from 'lucide-react';
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
  onSelectRelatedArtifact?: (title: string) => void;
}

export const LeftSidebarPane: React.FC<LeftSidebarPaneProps> = ({
  width,
  onWidthChange,
  tocItems = [
    { id: 'some-header-text', text: 'System Architecture & Lore Contracts', level: 1 },
    { id: '1-core-architecture-flow', text: '1. Core Architecture Flow', level: 2 },
    { id: '2-backend-api-contracts--endpoints', text: '2. Backend API Contracts & Endpoints', level: 2 },
    { id: '3-subtype-matrix--governance', text: '3. Subtype Matrix & Governance', level: 2 },
    { id: '4-key-roadmap-tasks--checklists', text: '4. Key Roadmap Tasks & Checklists', level: 2 },
    { id: '5-architectural-diagram-asset', text: '5. Architectural Diagram Asset', level: 2 },
  ],
  activeHeadingId = 'some-header-text',
  onSelectHeading,
  onSelectRelatedArtifact,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

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
      {/* Upper Section: Table of Contents */}
      <div style={styles.sectionHeader}>
        <List size={15} style={{ color: tokens.colors.textSecondary, marginRight: '8px' }} />
        <span style={styles.headerTitle}>Contents</span>
      </div>

      <div style={styles.tocList}>
        {tocItems.map((item) => {
          const isActive = activeHeadingId === item.id;
          const indent = (item.level - 1) * 12;
          return (
            <div
              key={item.id}
              onClick={() => onSelectHeading && onSelectHeading(item.id)}
              style={{
                ...styles.tocRow,
                paddingLeft: `${10 + indent}px`,
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

      {/* Hairline Section Separator */}
      <div style={styles.divider} />

      {/* Lower Section: Related Artifacts & Graph Navigation */}
      <div style={styles.sectionHeader}>
        <GitFork size={15} style={{ color: '#38bdf8', marginRight: '8px' }} />
        <span style={styles.headerTitle}>Related Artifacts</span>
      </div>

      <div style={styles.graphContainer}>
        {/* Derived From */}
        <div style={styles.graphGroup}>
          <span style={styles.groupLabel}>▲ Derived From (2)</span>
          <div
            style={styles.graphRow}
            onClick={() => onSelectRelatedArtifact?.('PRD Lore v2')}
            title="PRD Lore v2"
          >
            <FileText size={12} style={{ color: '#60a5fa', marginRight: '8px', flexShrink: 0 }} />
            <span style={styles.graphText}>PRD Lore v2</span>
          </div>
          <div
            style={styles.graphRow}
            onClick={() => onSelectRelatedArtifact?.('Research Phase')}
            title="Research Phase"
          >
            <FileText size={12} style={{ color: '#60a5fa', marginRight: '8px', flexShrink: 0 }} />
            <span style={styles.graphText}>Research Phase</span>
          </div>
        </div>

        {/* Used In */}
        <div style={styles.graphGroup}>
          <span style={styles.groupLabel}>▼ Used In (3)</span>
          <div
            style={styles.graphRow}
            onClick={() => onSelectRelatedArtifact?.('Lore Core SDK')}
            title="Lore Core SDK"
          >
            <Layers size={12} style={{ color: '#3fb950', marginRight: '8px', flexShrink: 0 }} />
            <span style={styles.graphText}>Lore Core SDK</span>
          </div>
          <div
            style={styles.graphRow}
            onClick={() => onSelectRelatedArtifact?.('Skill Registry')}
            title="Skill Registry"
          >
            <Layers size={12} style={{ color: '#3fb950', marginRight: '8px', flexShrink: 0 }} />
            <span style={styles.graphText}>Skill Registry</span>
          </div>
          <div
            style={styles.graphRow}
            onClick={() => onSelectRelatedArtifact?.('MCP Spec')}
            title="MCP Spec"
          >
            <Layers size={12} style={{ color: '#3fb950', marginRight: '8px', flexShrink: 0 }} />
            <span style={styles.graphText}>MCP Spec</span>
          </div>
        </div>

        {/* Governed By */}
        <div style={styles.graphGroup}>
          <span style={styles.groupLabel}>● Policy & Governance</span>
          <div style={styles.graphRowStatic}>
            <ShieldCheck size={12} style={{ color: '#f59e0b', marginRight: '8px', flexShrink: 0 }} />
            <span style={styles.graphText}>Zero-Trust Auth Policy</span>
          </div>
        </div>
      </div>

      {/* Invisible Drag-to-Resize Right Border Handle */}
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
    padding: '28px 16px 20px 16px',
    userSelect: 'none',
    flexShrink: 0,
    position: 'relative',
    overflowY: 'auto',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '14px',
    paddingLeft: '4px',
  },
  headerTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: tokens.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  tocList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    marginBottom: '16px',
  },
  tocRow: {
    paddingTop: '6px',
    paddingBottom: '6px',
    paddingRight: '10px',
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
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    margin: '12px 0 16px 0',
  },
  graphContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  graphGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  groupLabel: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    paddingLeft: '4px',
    marginBottom: '2px',
  },
  graphRow: {
    padding: '6px 10px',
    borderRadius: tokens.radii.sm,
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: tokens.colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  graphRowStatic: {
    padding: '6px 10px',
    borderRadius: tokens.radii.sm,
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: tokens.colors.textSecondary,
  },
  graphText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resizeHandle: {
    position: 'absolute',
    top: 0,
    right: '-5px',
    width: '100%',
    height: '100%',
    cursor: 'col-resize',
    zIndex: 30,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
};
