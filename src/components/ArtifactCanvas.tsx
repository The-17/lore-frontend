import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import type { Artifact, ArtifactVersion, Relationship } from '../types';
import { ChevronLeft, ArrowLeft } from 'lucide-react';

interface ArtifactCanvasProps {
  artifact: Artifact | null;
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

  if (!artifact) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          <h3 style={{ color: '#888888' }}>No Artifact Selected</h3>
          <p style={{ fontSize: '14px', color: '#666666', marginTop: '8px' }}>
            Select an artifact or click a [[Wiki-Link]] to view.
          </p>
        </div>
      </div>
    );
  }

  const rawContent = artifact.content || artifact.skill_md_content || artifact.decision_text || '';

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
            [[{title}]]
          </button>
        );
      }
      return part;
    });
  };

  const sanitizedHtml = DOMPurify.sanitize(rawContent);

  // Extract relations for footer
  const outboundReferences = relationships.filter((r) => r.relation_type === 'references');
  const derivedFrom = relationships.find((r) => r.relation_type === 'derived_from');

  // Render line diffs (+ green, - red)
  const renderLineDiffs = (diffText: string) => {
    const lines = diffText.split('\n');
    return lines.map((line, idx) => {
      let lineStyle: React.CSSProperties = { color: '#a1a1aa' };
      if (line.startsWith('+')) {
        lineStyle = { color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.12)', padding: '2px 6px', borderRadius: '4px' };
      } else if (line.startsWith('-')) {
        lineStyle = { color: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.12)', padding: '2px 6px', borderRadius: '4px' };
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

  const currentDiff = versions.find((v) => v.version_number === artifact.current_version_number)?.diff_content ||
    '@@ -4,6 +4,8 @@\n- Standardized API routes will use DRF endpoints.\n+ Standardized API routes will reference [[Django Ninja Patterns]] for all error handling.\n+ Authentication middleware will resolve both JWT Bearer tokens and [[Agent Token Security]] headers.';

  return (
    <div style={styles.container}>
      {/* Flush Card Sheet (#222226) */}
      <div style={styles.card}>
        {/* Top Header Bar */}
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backChevronBtn} title="Back">
            <ChevronLeft size={20} />
          </button>

          <div style={styles.headerRightActions}>
            {/* Peach / Tan Draft Badge */}
            <span style={getStateBadgeStyle(artifact.lifecycle_state)}>
              {artifact.lifecycle_state === 'draft'
                ? 'Draft'
                : artifact.lifecycle_state.replace('_', ' ')}
            </span>

            {/* Version Diff Badge */}
            <button
              onClick={() => setShowDiff(!showDiff)}
              style={styles.versionDiffBtn}
            >
              v{artifact.current_version_number || 3} (Diff)
            </button>

            {/* Primary Blue Approve Changes Button */}
            <button
              onClick={() => onApprove && onApprove(artifact.id)}
              style={styles.approveChangesBtn}
            >
              Approve Changes
            </button>
          </div>
        </div>

        {/* Centered Reading Column */}
        <div style={styles.centerColumn}>
          <div style={styles.body}>
            {showDiff ? (
              <div style={styles.diffContainer}>
                <div style={styles.diffHeader}>
                  <button onClick={() => setShowDiff(false)} style={styles.backBtn}>
                    <ArrowLeft size={14} style={{ marginRight: '4px' }} /> Back to Document
                  </button>
                  <span>Version History Diffs</span>
                </div>
                <div style={styles.diffContent}>
                  {renderLineDiffs(currentDiff)}
                </div>
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 style={styles.heading1}>{children}</h1>,
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
            )}
          </div>

          {/* Footer Provenance Row */}
          <div style={styles.footerRow}>
            {/* Left: Derived from */}
            <div style={styles.footerItem}>
              <span style={styles.footerLabel}>Derived from:</span>
              <button
                className="wiki-link"
                onClick={() => onSelectWikiLink && onSelectWikiLink(derivedFrom?.target_title || 'PRD Lore v2')}
              >
                [{derivedFrom?.target_title || 'PRD Lore v2'}]
              </button>
            </div>

            {/* Right: References */}
            <div style={styles.footerItem}>
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
              <span style={styles.countBadge}>+2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStateBadgeStyle = (state: string): React.CSSProperties => {
  const isDraft = state === 'draft';
  const isApproved = state === 'approved';

  return {
    fontSize: '13px',
    fontWeight: '600',
    color: isDraft ? '#4a2505' : isApproved ? '#064e3b' : '#713f12',
    backgroundColor: isDraft ? '#f5d0b5' : isApproved ? '#a7f3d0' : '#fef08a',
    padding: '4px 16px',
    borderRadius: '16px',
    textTransform: 'capitalize',
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
    backgroundColor: '#1c1c1f',
  },
  emptyContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '40px',
  },
  card: {
    width: '100%',
    height: '100vh',
    maxWidth: '100%',
    backgroundColor: '#222226',
    borderRadius: '20px 0 0 20px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRight: 'none',
    padding: '40px 64px 28px 64px',
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
    marginBottom: '20px',
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
  },
  versionDiffBtn: {
    background: 'none',
    border: 'none',
    color: '#d4d4d8',
    fontSize: '14px',
    fontWeight: '400',
    cursor: 'pointer',
  },
  approveChangesBtn: {
    backgroundColor: '#2563eb',
    border: 'none',
    color: '#ffffff',
    padding: '10px 22px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  centerColumn: {
    flex: 1,
    maxWidth: '820px',
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
    paddingRight: '12px',
  },
  heading1: {
    fontSize: '34px',
    fontWeight: '600',
    color: '#ffffff',
    marginTop: '36px',
    marginBottom: '28px',
    letterSpacing: '-0.5px',
  },
  heading2: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#ffffff',
    marginTop: '32px',
    marginBottom: '16px',
  },
  paragraph: {
    fontSize: '15px',
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
    fontSize: '14px',
    lineHeight: '1.6',
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
  },
  diffContent: {
    fontFamily: 'monospace',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    paddingTop: '20px',
    flexShrink: 0,
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  footerLabel: {
    color: '#888888',
  },
  countBadge: {
    backgroundColor: '#333333',
    color: '#a1a1aa',
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '12px',
  },
};
