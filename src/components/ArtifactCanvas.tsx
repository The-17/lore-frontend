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
          <h3 style={{ color: 'var(--text-muted)' }}>No Artifact Selected</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '8px' }}>
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

  return (
    <div style={styles.container}>
      {/* Full Experience Card Sheet (#242424 - No Drop Shadow) */}
      <div style={styles.card}>
        {/* Top Header Bar */}
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backChevronBtn} title="Back to Workspace">
            <ChevronLeft size={20} />
          </button>

          <div style={styles.headerRightActions}>
            {/* Draft / Lifecycle State Pill */}
            <span style={getStateBadgeStyle(artifact.lifecycle_state)}>
              {artifact.lifecycle_state === 'draft'
                ? 'Draft'
                : artifact.lifecycle_state.replace('_', ' ')}
            </span>

            {/* Version Diff Badge showing line additions/deletions stats: v3 (+12 -3) */}
            <button
              onClick={() => setShowDiff(!showDiff)}
              style={styles.versionDiffBtn}
            >
              v{artifact.current_version_number || 3} (+12 -3)
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
              <pre style={styles.diffContent}>
                {versions.find((v) => v.version_number === artifact.current_version_number)?.diff_content ||
                  '@@ -4,6 +4,8 @@\n- Standardized API routes will use DRF endpoints.\n+ Standardized API routes will reference [[Django Ninja Patterns]] for all error handling.\n+ Authentication middleware will resolve both JWT Bearer tokens and [[Agent Token Security]] headers.'}
              </pre>
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
            <span style={{ color: '#a1a1aa' }}>Derived from:</span>
            <button
              className="wiki-link"
              onClick={() => onSelectWikiLink && onSelectWikiLink(derivedFrom?.target_title || 'PRD Lore v2')}
            >
              [{derivedFrom?.target_title || 'PRD Lore v2'}]
            </button>
          </div>

          {/* Right: References */}
          <div style={styles.footerItem}>
            <span style={{ color: '#a1a1aa' }}>References:</span>
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
    backgroundColor: isDraft ? 'rgba(251, 146, 60, 0.2)' : isApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
    padding: '4px 14px',
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
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto',
    backgroundColor: 'var(--bg-app)',
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
    height: '100%',
    backgroundColor: '#242424',
    borderRadius: '16px',
    border: 'none',
    padding: '36px 48px',
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
    color: '#a1a1aa',
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
    color: '#e4e4e7',
    fontSize: '13px',
    fontWeight: '500',
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
    borderRadius: '10px',
    padding: '20px',
    fontFamily: 'monospace',
    fontSize: '13px',
  },
  diffHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    color: '#a1a1aa',
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
    whiteSpace: 'pre-wrap',
    color: '#a1a1aa',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: '#a1a1aa',
    paddingTop: '20px',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
