import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { ChevronLeft, ArrowLeft } from 'lucide-react';
import { tokens } from '../design-system/tokens';
import { WikiLink } from './WikiLink';

interface ArtifactCanvasProps {
  artifact?: any;
  versions?: any[];
  relationships?: any[];
  onBack?: () => void;
  onSelectWikiLink?: (title: string) => void;
  onApprove?: (id: string) => void;
}

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({ onSelectWikiLink }) => {
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
          <WikiLink
            key={i}
            title={title}
            onNavigate={onSelectWikiLink}
          />
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
        {/* Absolute Top-Left Back Chevron */}
        <button style={styles.backChevronBtn} title="Back">
          <ChevronLeft size={20} />
        </button>

        {/* Absolute Top-Right Glassmorphic Floating Header Action Tube Pill */}
        <div style={styles.glassHeaderActionTube}>
          {/* Subtle Muted Draft Badge */}
          <span style={styles.subtleDraftBadge}>Draft</span>

          {/* Diff Stat Button inside Pill */}
          <button
            onClick={() => setShowDiff(!showDiff)}
            style={styles.tubeDiffBtn}
            title="Toggle Line Diffs"
          >
            <span style={{ color: tokens.colors.textSecondary, fontSize: '13px', fontWeight: '500' }}>v3</span>
            <span style={styles.addStatBadge}>+12</span>
            <span style={styles.delStatBadge}>-3</span>
          </button>

          {/* Primary Aprove changes Button inside Pill */}
          <button style={styles.tubeApproveBtn}>
            Aprove changes
          </button>
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
                  h1: ({ children }) => (
                    <h1 id="some-header-text" style={styles.heading1}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 id="core-system-architecture--lore-contracts" style={styles.heading2}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = text.toLowerCase().includes('backend')
                      ? 'backend-endpoints--api-contract'
                      : 'lifecycle-states--subtypes';
                    return (
                      <h3 id={id} style={styles.heading3}>
                        {children}
                      </h3>
                    );
                  },
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
    backgroundColor: tokens.colors.bgApp,
  },
  card: {
    width: '100%',
    height: '100vh',
    maxWidth: '100%',
    backgroundColor: tokens.colors.bgCard,
    borderRadius: tokens.radii.none,
    border: 'none',
    padding: '20px 48px 16px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: 'none',
    overflow: 'hidden',
    margin: 0,
    position: 'relative',
  },
  backChevronBtn: {
    position: 'absolute',
    left: '48px',
    top: '28px',
    background: 'none',
    border: 'none',
    color: tokens.colors.textDim,
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 10,
  },
  glassHeaderActionTube: {
    position: 'absolute',
    right: '48px',
    top: '20px',
    backgroundColor: tokens.colors.bgGlass,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${tokens.colors.borderGlass}`,
    boxShadow: tokens.shadows.glass,
    borderRadius: tokens.radii.pill,
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 10,
  },
  subtleDraftBadge: {
    fontSize: '13px',
    fontWeight: '500',
    color: tokens.colors.textSecondary,
    backgroundColor: tokens.colors.badgeDraftBg,
    padding: '6px 14px',
    borderRadius: tokens.radii.lg,
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
    padding: '6px 10px',
    borderRadius: '8px',
  },
  addStatBadge: {
    color: tokens.colors.diffAddText,
    backgroundColor: tokens.colors.diffAddBg,
    padding: '3px 7px',
    borderRadius: tokens.radii.sm,
    fontSize: '12px',
    fontWeight: '600',
  },
  delStatBadge: {
    color: tokens.colors.diffDelText,
    backgroundColor: tokens.colors.diffDelBg,
    padding: '3px 7px',
    borderRadius: tokens.radii.sm,
    fontSize: '12px',
    fontWeight: '600',
  },
  tubeApproveBtn: {
    backgroundColor: tokens.colors.accentPrimary,
    border: 'none',
    color: '#ffffff',
    padding: '8px 20px',
    borderRadius: '18px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  centerColumn: {
    flex: 1,
    maxWidth: tokens.layout.readingMeasureWidth,
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    height: '100%',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '4px',
    paddingTop: '8px',
  },
  heading1: {
    fontSize: tokens.typography.h1.fontSize,
    fontWeight: tokens.typography.h1.fontWeight,
    color: tokens.colors.textPrimary,
    marginTop: '44px',
    marginBottom: '28px',
    letterSpacing: tokens.typography.h1.letterSpacing,
  },
  heading2: {
    fontSize: tokens.typography.h2.fontSize,
    fontWeight: tokens.typography.h2.fontWeight,
    color: tokens.colors.textPrimary,
    marginTop: '32px',
    marginBottom: '16px',
  },
  heading3: {
    fontSize: tokens.typography.h3.fontSize,
    fontWeight: tokens.typography.h3.fontWeight,
    color: tokens.colors.textPrimary,
    marginTop: '24px',
    marginBottom: '12px',
  },
  paragraph: {
    fontSize: tokens.typography.body.fontSize,
    lineHeight: tokens.typography.body.lineHeight,
    color: tokens.colors.textPrimary,
    marginBottom: '24px',
  },
  blockquote: {
    borderLeft: '3px solid #10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: '12px 18px',
    borderRadius: '0 8px 8px 0',
    color: tokens.colors.textPrimary,
    fontSize: '15px',
    fontStyle: 'italic',
    marginBottom: '24px',
  },
  ul: {
    marginBottom: '24px',
    paddingLeft: '24px',
    color: tokens.colors.textPrimary,
  },
  ol: {
    marginBottom: '24px',
    paddingLeft: '24px',
    color: tokens.colors.textPrimary,
  },
  li: {
    fontSize: tokens.typography.body.fontSize,
    lineHeight: tokens.typography.body.lineHeight,
    marginBottom: '8px',
  },
  inlineCode: {
    backgroundColor: '#202024',
    color: '#38bdf8',
    padding: '2px 6px',
    borderRadius: tokens.radii.sm,
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '14px',
  },
  codeBlock: {
    backgroundColor: '#18181c',
    border: '1px solid #333338',
    borderRadius: tokens.radii.sm,
    padding: '16px',
    marginBottom: '24px',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '14px',
    lineHeight: '1.6',
    color: tokens.colors.textPrimary,
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
    color: tokens.colors.textPrimary,
    textAlign: 'left',
    padding: '10px 14px',
    borderBottom: '1px solid #38383e',
    fontWeight: '600',
  },
  td: {
    padding: '10px 14px',
    borderBottom: '1px solid #202024',
    color: tokens.colors.textPrimary,
  },
  githubDiffViewer: {
    backgroundColor: '#141417',
    borderRadius: '8px',
    border: '1px solid #30363d',
    padding: '16px',
    marginTop: '44px',
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
    fontSize: tokens.typography.caption.fontSize,
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
    color: tokens.colors.textSecondary,
  },
  footerValue: {
    color: tokens.colors.textPrimary,
    fontWeight: '400',
  },
  countBadge: {
    backgroundColor: '#383838',
    color: tokens.colors.textSecondary,
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '10px',
  },
};
