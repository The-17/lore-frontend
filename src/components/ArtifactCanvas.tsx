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
          <p style={{ fontSize: '13px', color: '#666666', marginTop: '8px' }}>
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

  // Render colored line diffs (+ green, - red)
  const renderLineDiffs = (diffText: string) => {
    const lines = diffText.split('\n');
    return lines.map((line, idx) => {
      let lineStyle: React.CSSProperties = { color: '#a1a1aa' };
      if (line.startsWith('+')) {
        lineStyle = { color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '2px 4px', borderRadius: '2px' };
      } else if (line.startsWith('-')) {
        lineStyle = { color: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.1)', padding: '2px 4px', borderRadius: '2px' };
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
      {/* Full Experience Card Sheet (#242424) */}
      <div style={styles.card}>
        {/* Top Header Bar */}
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backChevronBtn} title="Back">
            <ChevronLeft size={20} />
          </button>

          <div style={styles.headerRightActions}>
            {/* Draft / Lifecycle State Pill */}
            <span style={getStateBadgeStyle(artifact.lifecycle_state)}>
              {artifact.lifecycle_state === 'draft'
                ? 'Draft'
                : artifact.lifecycle_state.replace('_', ' ')}
            </span>

            {/* Version Diff Badge with Green + and Red - stats */}
            <button
              onClick={() => setShowDiff(!showDiff)}
              style={styles.versionDiffBtn}
            >
              v{artifact.current_version_number || 3} (
              <span style={{ color: '#22c55e' }}>+12</span>{' '}
              <span style={{ color: '#f87171' }}>-3</span>)
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

        {/* Markdown Body Content */}
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
  );
};

const getStateBadgeStyle = (state: string): React.CSSProperties => {
  const isDraft = state === 'draft';
  const isApproved = state === 'approved';

  return {
    fontSize: '13px',
    fontWeight: '500',
    color: isDraft ? '#fdba74' : isApproved ? '#10b981' : '#f59e0b',
    backgroundColor: isDraft ? 'rgba(251, 146, 60, 0.18)' : isApproved ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.18)',
    padding: '5px 14px',
    borderRadius: '16px',
    textTransform: 'capitalize',
    display: 'inline-flex',
    alignItems: 'center',
  };
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    height: '100%',
    padding: '36px 48px',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto',
    backgroundColor: '#222222',
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
    maxWidth: '920px',
    height: '100%',
    backgroundColor: '#242424',
    borderRadius: '20px',
    border: 'none',
    padding: '44px 56px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
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
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  approveChangesBtn: {
    backgroundColor: '#2563eb',
    border: 'none',
    color: '#ffffff',
    padding: '10px 22px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  body: {
    flex: 1,
    marginBottom: '40px',
    overflowY: 'auto',
  },
  heading1: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ffffff',
    marginTop: '20px',
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
    lineHeight: '1.8',
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
    padding: '20px',
    fontFamily: 'monospace',
    fontSize: '13px',
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
    fontSize: '13px',
    paddingTop: '24px',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerLabel: {
    color: '#888888',
  },
  countBadge: {
    backgroundColor: '#333333',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '10px',
  },
};
