import React, { useState } from 'react';
import { ChevronLeft, ArrowLeft } from 'lucide-react';

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

  // Standard GitHub Unified Diff representation
  const sampleGitHubDiff = [
    { type: 'header', text: '@@ -4,6 +4,8 @@' },
    { type: 'deletion', text: '- Standardized API routes will use DRF endpoints.' },
    { type: 'addition', text: '+ Standardized API routes will reference [[Django Ninja Patterns]] for all error handling.' },
    { type: 'addition', text: '+ Authentication middleware will resolve both JWT Bearer tokens and [[Agent Token Security]] headers.' },
  ];

  return (
    <div style={styles.container}>
      {/* Darker Main Card (#1e1e1e) - Zero Radius, Zero Borders */}
      <div style={styles.card}>
        {/* Top Header Bar */}
        <div style={styles.header}>
          <button style={styles.backChevronBtn} title="Back">
            <ChevronLeft size={20} />
          </button>

          <div style={styles.headerRightActions}>
            {/* Lighter, Warm Soft Peach Draft Badge (NO Border, NO Dot) */}
            <span style={styles.draftBadge}>Draft</span>

            {/* GitHub Style Version Diff Stat Badge */}
            <button
              onClick={() => setShowDiff(!showDiff)}
              style={styles.versionDiffBtn}
            >
              v3 (<span style={{ color: '#3fb950', fontWeight: '600' }}>+12</span>{' '}
              <span style={{ color: '#f85149', fontWeight: '600' }}>−3</span>)
            </button>

            {/* Flat Royal Blue Approve Changes Button (NO Border) */}
            <button style={styles.approveChangesBtn}>
              Approve Changes
            </button>
          </div>
        </div>

        {/* Centered Typography Reading Column */}
        <div style={styles.centerColumn}>
          <div style={styles.body}>
            {showDiff ? (
              <div style={styles.githubDiffViewer}>
                <div style={styles.diffHeaderBar}>
                  <button onClick={() => setShowDiff(false)} style={styles.backToDocBtn}>
                    <ArrowLeft size={14} style={{ marginRight: '6px' }} /> Return to Document
                  </button>
                  <span style={{ color: '#8b949e', fontSize: '12px' }}>Unified GitHub Diff View</span>
                </div>
                <div style={styles.diffLinesList}>
                  {sampleGitHubDiff.map((line, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.diffLineRow,
                        ...(line.type === 'addition'
                          ? styles.additionLine
                          : line.type === 'deletion'
                          ? styles.deletionLine
                          : styles.headerLine),
                      }}
                    >
                      <span style={styles.linePrefix}>{line.text.slice(0, 1)}</span>
                      <span>{line.text.slice(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h1 style={styles.heading1}>Some header text</h1>

                <p style={styles.paragraph}>{loremParagraph}</p>
                <p style={styles.paragraph}>{loremParagraph}</p>
                <p style={styles.paragraph}>{loremParagraph}</p>
                <p style={styles.paragraph}>{loremParagraph}</p>
              </>
            )}
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
    backgroundColor: '#121212',
  },
  card: {
    width: '100%',
    height: '100vh',
    maxWidth: '100%',
    backgroundColor: '#1e1e1e',
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
    fontWeight: '600',
    color: '#5c3310',
    backgroundColor: '#ebd0b9',
    border: 'none',
    padding: '6px 18px',
    borderRadius: '18px',
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
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
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
  githubDiffViewer: {
    backgroundColor: '#0d1117',
    borderRadius: '8px',
    border: '1px solid #30363d',
    padding: '16px',
    marginTop: '20px',
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
  },
  diffHeaderBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #30363d',
  },
  backToDocBtn: {
    background: 'none',
    border: 'none',
    color: '#58a6ff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
  },
  diffLinesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  diffLineRow: {
    padding: '4px 10px',
    borderRadius: '4px',
    display: 'flex',
    gap: '8px',
  },
  linePrefix: {
    userSelect: 'none',
    fontWeight: '700',
    width: '12px',
  },
  additionLine: {
    backgroundColor: 'rgba(46, 160, 67, 0.15)',
    color: '#3fb950',
  },
  deletionLine: {
    backgroundColor: 'rgba(248, 81, 73, 0.15)',
    color: '#f85149',
  },
  headerLine: {
    backgroundColor: 'rgba(56, 139, 253, 0.15)',
    color: '#58a6ff',
    fontStyle: 'italic',
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
