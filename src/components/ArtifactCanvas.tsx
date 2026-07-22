import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import type { Artifact, ArtifactVersion, Relationship } from '../types';
import { ChevronLeft, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ArtifactCanvasProps {
  artifact?: Artifact | null;
  versions?: ArtifactVersion[];
  relationships?: Relationship[];
  onBack?: () => void;
  onSelectWikiLink?: (title: string) => void;
  onApprove?: (id: string) => void;
}

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({
  artifact,
  versions = [],
  relationships = [],
  onBack,
  onSelectWikiLink,
  onApprove,
}) => {
  const [showDiff, setShowDiff] = useState(false);

  // Wiki Link Renderer
  const renderContentWithWikiLinks = (text: string) => {
    const parts = text.split(/(\[\[.*?\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const title = part.slice(2, -2);
        return (
          <button
            key={i}
            className="wiki-link"
            onClick={() => onSelectWikiLink && onSelectWikiLink(title)}
          >
            [{title}]
          </button>
        );
      }
      return part;
    });
  };

  const loremParagraph =
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.';

  const rawContent = artifact?.content || artifact?.skill_md_content || artifact?.decision_text || loremParagraph;
  const sanitizedHtml = DOMPurify.sanitize(rawContent);

  // Extract relations for footer
  const outboundReferences = relationships.filter((r) => r.relation_type === 'references');
  const derivedFrom = relationships.find((r) => r.relation_type === 'derived_from');

  // Find active version diff text
  const currentVersionNumber = artifact?.current_version_number || 3;
  const activeVersion = versions.find((v) => v.version_number === currentVersionNumber);
  const currentDiffText =
    activeVersion?.diff_content ||
    '@@ -4,6 +4,8 @@\n- Standardized API routes will use DRF endpoints.\n+ Standardized API routes will reference [[Django Ninja Patterns]] for all error handling.\n+ Authentication middleware will resolve both JWT Bearer tokens and [[Agent Token Security]] headers.\n+ Added automatic diff line parser with green additions and red deletions.';

  // Calculate actual addition (+) and deletion (-) line counts from the diff text
  const calculateDiffStats = (diffText: string) => {
    const lines = diffText.split('\n');
    let additions = 0;
    let deletions = 0;
    lines.forEach((line) => {
      if (line.startsWith('+') && !line.startsWith('+++')) additions++;
      if (line.startsWith('-') && !line.startsWith('---')) deletions++;
    });
    return { additions, deletions };
  };

  const { additions, deletions } = calculateDiffStats(currentDiffText);

  // Render colored line diffs (+ green, - red)
  const renderLineDiffs = (diffText: string) => {
    const lines = diffText.split('\n');
    return lines.map((line, idx) => {
      let lineStyle: React.CSSProperties = { color: '#a1a1aa' };
      if (line.startsWith('+') && !line.startsWith('+++')) {
        lineStyle = { color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.12)', padding: '3px 8px', borderRadius: '4px' };
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        lineStyle = { color: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.12)', padding: '3px 8px', borderRadius: '4px' };
      } else if (line.startsWith('@@')) {
        lineStyle = { color: '#38bdf8', fontStyle: 'italic' };
      }
      return (
        <div key={idx} style={lineStyle}>
          {line}
        </div>
      );
    });
  };

  const lifecycleState = artifact?.lifecycle_state || 'draft';

  return (
    <div style={styles.container}>
      {/* Main Content Card (#282828) - Completely Square Borders (No Radius) */}
      <div style={styles.card}>
        {/* Top Header Bar (Pushed UP and Far Right) */}
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backChevronBtn} title="Back">
            <ChevronLeft size={20} />
          </button>

          <div style={styles.headerRightActions}>
            {/* Styled State Badge (Draft = Warm Amber/Peach) */}
            <span style={getStateBadgeStyle(lifecycleState)}>
              {lifecycleState === 'draft'
                ? 'Draft'
                : lifecycleState.replace('_', ' ')}
            </span>

            {/* v3 Diff Button showing Actual Addition (+) and Deletion (-) Line Counts */}
            <button
              onClick={() => setShowDiff(!showDiff)}
              style={styles.versionDiffBtn}
              title="Toggle Version Line Diffs"
            >
              v{currentVersionNumber} (
              <span style={{ color: '#22c55e', fontWeight: '600' }}>+{additions}</span>{' '}
              <span style={{ color: '#f87171', fontWeight: '600' }}>-{deletions}</span>)
            </button>

            {/* Premium Primary Blue Approve Changes Button */}
            <button
              onClick={() => artifact && onApprove && onApprove(artifact.id)}
              style={styles.approveChangesBtn}
            >
              <CheckCircle2 size={15} style={{ marginRight: '6px' }} />
              Approve Changes
            </button>
          </div>
        </div>

        {/* Centered Typography Reading Column */}
        <div style={styles.centerColumn}>
          <div style={styles.body}>
            {showDiff ? (
              <div style={styles.diffContainer}>
                <div style={styles.diffHeader}>
                  <button onClick={() => setShowDiff(false)} style={styles.backBtn}>
                    <ArrowLeft size={14} style={{ marginRight: '4px' }} /> Back to Document
                  </button>
                  <span style={{ color: '#ffffff', fontWeight: '500' }}>
                    Version History Diffs (v{currentVersionNumber})
                  </span>
                </div>
                <div style={styles.diffContent}>
                  {renderLineDiffs(currentDiffText)}
                </div>
              </div>
            ) : (
              <div>
                <h1 style={styles.heading1}>{artifact?.title || 'Some header text'}</h1>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => <h2 style={styles.heading2}>{children}</h2>,
                    p: ({ children }) => (
                      <p style={styles.paragraph}>
                        {React.Children.map(children, (child) =>
                          typeof child === 'string' ? renderContentWithWikiLinks(child) : child
                        )}
                      </p>
                    ),
                    code: ({ children }) => (
                      <code style={styles.codeSnippet}>{children}</code>
                    ),
                  }}
                >
                  {sanitizedHtml}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Footer Provenance Row (Compact & Smaller: Derived From Centered, References Far Right) */}
        <div style={styles.footerRow}>
          {/* Centered: Derived from */}
          <div style={styles.footerCenterItem}>
            <span style={styles.footerLabel}>Derived from:</span>
            <button
              className="wiki-link"
              onClick={() => onSelectWikiLink && onSelectWikiLink(derivedFrom?.target_title || 'PRD Lore v2')}
            >
              [{derivedFrom?.target_title || 'PRD Lore v2'}]
            </button>
          </div>

          {/* Far Right: References */}
          <div style={styles.footerRightItem}>
            <span style={styles.footerLabel}>References:</span>
            <button
              className="wiki-link"
              onClick={() =>
                onSelectWikiLink &&
                onSelectWikiLink(outboundReferences[0]?.target_title || 'Django Ninja Patterns')
              }
            >
              [{outboundReferences[0]?.target_title || 'Django Ninja Patterns'}]
            </button>
            <span style={styles.countBadge}>
              +{outboundReferences.length > 0 ? outboundReferences.length : 2}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStateBadgeStyle = (state: string): React.CSSProperties => {
  const isDraft = state === 'draft';
  const isApproved = state === 'approved';

  if (isDraft) {
    return {
      fontSize: '13px',
      fontWeight: '600',
      color: '#d97706',
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      padding: '5px 16px',
      borderRadius: '16px',
      display: 'inline-flex',
      alignItems: 'center',
    };
  }

  if (isApproved) {
    return {
      fontSize: '13px',
      fontWeight: '600',
      color: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      padding: '5px 16px',
      borderRadius: '16px',
      display: 'inline-flex',
      alignItems: 'center',
    };
  }

  return {
    fontSize: '13px',
    fontWeight: '600',
    color: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    padding: '5px 16px',
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
  };
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
  versionDiffBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  approveChangesBtn: {
    backgroundColor: '#2563eb',
    backgroundImage: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
    color: '#ffffff',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
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
  heading2: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#ffffff',
    marginTop: '28px',
    marginBottom: '16px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.75',
    color: '#d4d4d8',
    marginBottom: '24px',
  },
  codeSnippet: {
    backgroundColor: '#18181b',
    padding: '3px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#e4e4e7',
  },
  diffContainer: {
    backgroundColor: '#18181b',
    borderRadius: '12px',
    padding: '24px',
    fontFamily: 'monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  diffHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    color: '#888888',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#10b981',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
  },
  diffContent: {
    fontFamily: 'monospace',
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
  countBadge: {
    backgroundColor: '#383838',
    color: '#a1a1aa',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '10px',
  },
};
