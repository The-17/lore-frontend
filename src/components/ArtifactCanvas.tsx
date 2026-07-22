import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface ArtifactCanvasProps {
  artifact?: any;
  versions?: any[];
  relationships?: any[];
  onBack?: () => void;
  onSelectWikiLink?: (title: string) => void;
  onApprove?: (id: string) => void;
}

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = () => {
  const [showDiff, setShowDiff] = useState(false);

  const loremParagraph =
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.';

  return (
    <div style={styles.container}>
      {/* Main Content Card (#282828) - Completely Square Borders (No Radius) */}
      <div style={styles.card}>
        {/* Top Header Bar */}
        <div style={styles.header}>
          <button style={styles.backChevronBtn} title="Back">
            <ChevronLeft size={20} />
          </button>

          <div style={styles.headerRightActions}>
            {/* Soft Peach Draft Badge */}
            <span style={styles.draftBadge}>Draft</span>

            {/* v3 (Diff) Button */}
            <button
              onClick={() => setShowDiff(!showDiff)}
              style={styles.versionDiffBtn}
            >
              v3 (Diff)
            </button>

            {/* Primary Blue Approve Changes Button */}
            <button style={styles.approveChangesBtn}>
              Approve Changes
            </button>
          </div>
        </div>

        {/* Centered Typography Reading Column */}
        <div style={styles.centerColumn}>
          <div style={styles.body}>
            <h1 style={styles.heading1}>Some header text</h1>

            <p style={styles.paragraph}>{loremParagraph}</p>
            <p style={styles.paragraph}>{loremParagraph}</p>
            <p style={styles.paragraph}>{loremParagraph}</p>
            <p style={styles.paragraph}>{loremParagraph}</p>
          </div>
        </div>

        {/* Footer Provenance Row */}
        <div style={styles.footerRow}>
          {/* Centered: Derived from */}
          <div style={styles.footerCenterItem}>
            <span style={styles.footerLabel}>Derived from:</span>
            <span style={styles.footerValue}>[PRD Lore v2]</span>
          </div>

          {/* Far Right: References */}
          <div style={styles.footerRightItem}>
            <span style={styles.footerLabel}>References:</span>
            <span style={styles.footerValue}>[Django Ninja Patterns]</span>
            <span style={styles.countBadge}>+2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    height: '100vh',
    width: '100%',
    padding: 0,
    margin: 0,
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
  },
  card: {
    width: '100%',
    height: '100vh',
    maxWidth: '100%',
    backgroundColor: '#282828',
    borderRadius: 0,
    border: 'none',
    padding: '24px 56px 16px 56px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: 'none',
    overflow: 'hidden',
    margin: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    marginTop: '-4px',
    width: '100%',
    flexShrink: 0,
  },
  backChevronBtn: {
    background: 'none',
    border: 'none',
    color: '#888888',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  headerRightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginLeft: 'auto',
  },
  draftBadge: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#5c3310',
    backgroundColor: '#ebd0b9',
    padding: '5px 16px',
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  versionDiffBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '400',
    cursor: 'pointer',
  },
  approveChangesBtn: {
    backgroundColor: '#2563eb',
    border: 'none',
    color: '#ffffff',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  centerColumn: {
    flex: 1,
    maxWidth: '740px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '4px',
  },
  heading1: {
    fontSize: '36px',
    fontWeight: '400',
    color: '#ffffff',
    marginTop: '20px',
    marginBottom: '28px',
    letterSpacing: '-0.5px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.75',
    color: '#d4d4d8',
    marginBottom: '24px',
  },
  footerRow: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    paddingTop: '16px',
    paddingBottom: '4px',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
  },
  footerCenterItem: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerRightItem: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerLabel: {
    color: '#a1a1aa',
  },
  footerValue: {
    color: '#ffffff',
    fontWeight: '400',
  },
  countBadge: {
    backgroundColor: '#383838',
    color: '#a1a1aa',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '10px',
  },
};
