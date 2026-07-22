import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
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

  // Rich Demo Markdown Content
  const markdownText = `# Some header text

Lorem ipsum dolor sit amet, **consectetur adipiscing elit**. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. See [[Django Ninja Patterns]] for API schemas and [[Agent Token Security]] for auth headers.

> Lore serves as the Artifact Plane for Humans and AI Agents, unifying persistent storage, semantic search, and human-in-the-loop governance.

## Core System Architecture & Lore Contracts

Ad litora torquent per conubia nostra inceptos himenaeos. Ut hendrerit semper vel class aptent taciti sociosqu:

- **Persistent Memory**: High-performance SQLite & PostgreSQL storage using \`Django ORM\`.
- **Semantic Graph**: Auto-extracted [[Wiki-Link]] dependencies and relationship lineage.
- **BYOB Infrastructure**: Bring-Your-Own-Backend endpoint configuration with token auth.

### Backend Endpoints & API Contract

Here is an example of the Ninja API endpoint contract:

\`\`\`python
@router.get("/artifacts/{artifact_id}", response=ArtifactSchema)
def get_artifact(request, artifact_id: UUID):
    """Retrieve artifact details along with provenance metadata."""
    artifact = get_object_or_404(Artifact, id=artifact_id)
    return artifact
\`\`\`

### Lifecycle States & Subtypes

| Artifact Subtype | Purpose & Description | Default State |
| :--- | :--- | :--- |
| \`Skill\` | Reusable agent tool or prompt workflow | \`approved\` |
| \`Decision\` | Architectural ADR and design rationale | \`draft\` |
| \`Document\` | Structured knowledge sheet article | \`under_review\` |

Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit.`;

  // Wiki Link Renderer
  const renderContentWithWikiLinks = (text: string) => {
    const parts = text.split(/(\[\[.*?\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const title = part.slice(2, -2);
        return (
          <span key={i} className="wiki-link">
            [{title}]
          </span>
        );
      }
      return part;
    });
  };

  const sanitizedHtml = DOMPurify.sanitize(markdownText);

  // Standard GitHub Unified Diff representation
  const sampleGitHubDiff = [
    { type: 'header', text: '@@ -4,6 +4,8 @@' },
    { type: 'deletion', text: '- Standardized API routes will use DRF endpoints.' },
    { type: 'addition', text: '+ Standardized API routes will reference [[Django Ninja Patterns]] for all error handling.' },
    { type: 'addition', text: '+ Authentication middleware will resolve both JWT Bearer tokens and [[Agent Token Security]] headers.' },
  ];

  return (
    <div style={styles.container}>
      {/* Main Card (#292929) - Zero Radius, Zero Borders */}
      <div style={styles.card}>
        {/* Top Header Bar */}
        <div style={styles.header}>
          {/* Far Left: Back Chevron */}
          <button style={styles.backChevronBtn} title="Back">
            <ChevronLeft size={20} />
          </button>

          {/* Centered Floating Header Action Tube Pill */}
          <div style={styles.headerActionTube}>
            {/* Subtle Muted Draft Badge */}
            <span style={styles.subtleDraftBadge}>Draft</span>

            {/* Diff Stat Button inside Pill */}
            <button
              onClick={() => setShowDiff(!showDiff)}
              style={styles.tubeDiffBtn}
              title="Toggle Line Diffs"
            >
              <span style={{ color: '#a1a1aa', fontSize: '12px', fontWeight: '500' }}>v3</span>
              <span style={styles.addStatBadge}>+12</span>
              <span style={styles.delStatBadge}>-3</span>
            </button>

            {/* Primary Aprove changes Button inside Pill */}
            <button style={styles.tubeApproveBtn}>
              Aprove changes
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 style={styles.heading1}>{children}</h1>,
                  h2: ({ children }) => <h2 style={styles.heading2}>{children}</h2>,
                  h3: ({ children }) => <h3 style={styles.heading3}>{children}</h3>,
                  p: ({ children }) => (
                    <p style={styles.paragraph}>
                      {React.Children.map(children, (child) =>
                        typeof child === 'string' ? renderContentWithWikiLinks(child) : child
                      )}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={styles.blockquote}>{children}</blockquote>
                  ),
                  ul: ({ children }) => <ul style={styles.ul}>{children}</ul>,
                  ol: ({ children }) => <ol style={styles.ol}>{children}</ol>,
                  li: ({ children }) => (
                    <li style={styles.li}>
                      {React.Children.map(children, (child) =>
                        typeof child === 'string' ? renderContentWithWikiLinks(child) : child
                      )}
                    </li>
                  ),
                  code: ({ inline, children }: any) =>
                    inline ? (
                      <code style={styles.inlineCode}>{children}</code>
                    ) : (
                      <pre style={styles.codeBlock}>
                        <code>{children}</code>
                      </pre>
                    ),
                  table: ({ children }) => <table style={styles.table}>{children}</table>,
                  th: ({ children }) => <th style={styles.th}>{children}</th>,
                  td: ({ children }) => <td style={styles.td}>{children}</td>,
                }}
              >
                {sanitizedHtml}
              </ReactMarkdown>
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
    backgroundColor: '#222222',
  },
  card: {
    width: '100%',
    height: '100vh',
    maxWidth: '100%',
    backgroundColor: '#292929',
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
    position: 'relative',
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
  headerActionTube: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#202020',
    borderRadius: '24px',
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: 'none',
  },
  subtleDraftBadge: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#a1a1aa',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: '4px 12px',
    borderRadius: '14px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  tubeDiffBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  addStatBadge: {
    color: '#3fb950',
    backgroundColor: 'rgba(46, 160, 67, 0.15)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  delStatBadge: {
    color: '#f85149',
    backgroundColor: 'rgba(248, 81, 73, 0.15)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  tubeApproveBtn: {
    backgroundColor: '#2563eb',
    border: 'none',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
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
    color: '#D4D4D4',
    marginTop: '20px',
    marginBottom: '28px',
    letterSpacing: '-0.5px',
  },
  heading2: {
    fontSize: '24px',
    fontWeight: '500',
    color: '#D4D4D4',
    marginTop: '32px',
    marginBottom: '16px',
  },
  heading3: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#D4D4D4',
    marginTop: '24px',
    marginBottom: '12px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.75',
    color: '#D4D4D4',
    marginBottom: '24px',
  },
  blockquote: {
    borderLeft: '3px solid #10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: '12px 18px',
    borderRadius: '0 8px 8px 0',
    color: '#D4D4D4',
    fontSize: '15px',
    fontStyle: 'italic',
    marginBottom: '24px',
  },
  ul: {
    marginBottom: '24px',
    paddingLeft: '24px',
    color: '#D4D4D4',
  },
  ol: {
    marginBottom: '24px',
    paddingLeft: '24px',
    color: '#D4D4D4',
  },
  li: {
    fontSize: '16px',
    lineHeight: '1.75',
    marginBottom: '8px',
  },
  inlineCode: {
    backgroundColor: '#202024',
    color: '#38bdf8',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '14px',
  },
  codeBlock: {
    backgroundColor: '#18181c',
    border: '1px solid #333338',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#D4D4D4',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '24px',
    fontSize: '14px',
  },
  th: {
    backgroundColor: '#202024',
    color: '#D4D4D4',
    textAlign: 'left',
    padding: '10px 14px',
    borderBottom: '1px solid #38383e',
    fontWeight: '600',
  },
  td: {
    padding: '10px 14px',
    borderBottom: '1px solid #202024',
    color: '#D4D4D4',
  },
  githubDiffViewer: {
    backgroundColor: '#141417',
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
    color: '#D4D4D4',
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
