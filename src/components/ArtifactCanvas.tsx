import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import type { Artifact, ArtifactVersion } from '../types';
import { CheckCircle, Clock, Tag, History, FileText, ArrowLeft } from 'lucide-react';

interface ArtifactCanvasProps {
  artifact: Artifact | null;
  versions?: ArtifactVersion[];
  onSelectWikiLink?: (title: string) => void;
}

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({
  artifact,
  versions = [],
  onSelectWikiLink,
}) => {
  const [showDiff, setShowDiff] = useState(false);

  if (!artifact) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          <FileText size={48} color="var(--text-dim)" />
          <h3 style={{ marginTop: '16px', color: 'var(--text-muted)' }}>No Artifact Selected</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '8px' }}>
            Select an artifact from the collection tree or click a [[Wiki-Link]] in the graph to view.
          </p>
        </div>
      </div>
    );
  }

  const rawContent = artifact.content || artifact.skill_md_content || artifact.decision_text || '';

  // Custom wiki link renderer for [[Title]]
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

  return (
    <div style={styles.container}>
      {/* Knowledge Sheet Card */}
      <div style={styles.card}>
        {/* Header Bar */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={getTypeBadgeStyle(artifact.type)}>
              <Tag size={12} style={{ marginRight: '4px' }} />
              {artifact.type.toUpperCase()}
            </span>
            <span style={getStateBadgeStyle(artifact.lifecycle_state)}>
              {artifact.lifecycle_state.replace('_', ' ')}
            </span>
          </div>

          <div style={styles.headerRight}>
            <button
              style={{ ...styles.actionBtn, backgroundColor: showDiff ? 'var(--bg-tube-hover)' : 'transparent' }}
              onClick={() => setShowDiff(!showDiff)}
            >
              <History size={14} style={{ marginRight: '6px' }} />
              Version v{artifact.current_version_number || 1}
            </button>
            <button style={styles.approveBtn}>
              <CheckCircle size={14} style={{ marginRight: '6px' }} />
              Approve
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 style={styles.title}>{artifact.title}</h1>

        {/* Decision / Rationale Metadata (if applicable) */}
        {artifact.rationale && (
          <div style={styles.rationaleBox}>
            <strong>Rationale:</strong> {artifact.rationale}
          </div>
        )}

        {/* Content Sheet Body */}
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
                  'No line diffs recorded for this snapshot.'}
              </pre>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p style={{ lineHeight: '1.7', marginBottom: '16px', color: '#e4e4e7' }}>
                    {React.Children.map(children, (child) =>
                      typeof child === 'string' ? renderContentWithWikiLinks(child) : child
                    )}
                  </p>
                ),
                h1: ({ children }) => <h1 style={{ marginBottom: '16px', color: '#ffffff' }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ marginTop: '24px', marginBottom: '12px', color: '#ffffff' }}>{children}</h2>,
                code: ({ children }) => (
                  <code style={{ background: '#18181b', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                    {children}
                  </code>
                ),
              }}
            >
              {sanitizedHtml}
            </ReactMarkdown>
          )}
        </div>

        {/* Footer Provenance Bar */}
        <div style={styles.footer}>
          <span style={styles.footerItem}>
            <Clock size={12} style={{ marginRight: '4px' }} />
            Updated {new Date(artifact.updated_at).toLocaleString()}
          </span>
          {artifact.usage_count !== undefined && (
            <span style={styles.footerItem}>
              ⚡ Skill Hydrations: {artifact.usage_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const getTypeBadgeStyle = (type: string): React.CSSProperties => {
  const colors: Record<string, string> = {
    skill: 'var(--accent-emerald)',
    decision: 'var(--accent-purple)',
    document: 'var(--accent-blue)',
    memory: 'var(--accent-amber)',
  };
  const color = colors[type] || 'var(--text-muted)';
  return {
    fontSize: '11px',
    fontWeight: '600',
    color,
    background: `${color}18`,
    border: `1px solid ${color}40`,
    padding: '3px 8px',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
  };
};

const getStateBadgeStyle = (state: string): React.CSSProperties => {
  const isApproved = state === 'approved';
  return {
    fontSize: '11px',
    fontWeight: '500',
    color: isApproved ? 'var(--accent-emerald)' : 'var(--accent-amber)',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-card)',
    padding: '3px 8px',
    borderRadius: '6px',
    textTransform: 'capitalize',
  };
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    height: '100%',
    padding: '24px',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto',
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
    maxWidth: '400px',
  },
  card: {
    width: '100%',
    maxWidth: '840px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-card)',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerLeft: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    background: 'transparent',
    border: '1px solid var(--border-card)',
    color: 'var(--text-muted)',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  approveBtn: {
    background: 'var(--accent-purple)',
    border: 'none',
    color: '#ffffff',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: '#ffffff',
    marginBottom: '16px',
  },
  rationaleBox: {
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    borderLeft: '3px solid var(--accent-purple)',
    padding: '12px 16px',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#e4e4e7',
    marginBottom: '24px',
  },
  body: {
    flex: 1,
    fontSize: '15px',
  },
  diffContainer: {
    backgroundColor: '#18181b',
    borderRadius: '8px',
    padding: '16px',
    fontFamily: 'monospace',
    fontSize: '13px',
  },
  diffHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    color: 'var(--text-muted)',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-emerald)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  diffContent: {
    whiteSpace: 'pre-wrap',
    color: '#a1a1aa',
  },
  footer: {
    marginTop: '32px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-card)',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'var(--text-dim)',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
  },
};
