import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { ChevronLeft, ArrowLeft, Copy, Check, ShieldCheck, Sparkles, Bookmark } from 'lucide-react';
import { tokens } from '../design-system/tokens';
import { WikiLink } from './WikiLink';
import { MermaidRenderer } from './MermaidRenderer';

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
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Comprehensive Lore Artifact Document with Semantic Block Callouts
  const markdownText = `# System Architecture & Lore Contracts

Lorem ipsum dolor sit amet, **consectetur adipiscing elit**. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. See [[Django Ninja Patterns]] for API schemas and [[Agent Token Security]] for auth headers.

> [!PRINCIPLE]
> Lore serves as the Artifact Plane for Humans and AI Agents, unifying persistent storage, semantic search, and human-in-the-loop governance.

> [!DECISION]
> All artifact schema definitions must remain additive-first, preserving backwards compatibility across SDK versions.

> [!INSIGHT]
> Persistent memory graphs reduce agent hallucinations by 84% when coupled with explicit relationship lineage.

---

## 1. Core Architecture Flow

Below is the interaction sequence diagram for human-agent collaboration, artifact creation, policy verification, and state transition:

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Human as Human Developer
    participant Agent as AI Coding Agent
    participant Gateway as Lore API Gateway
    participant Engine as Policy & Lineage Engine
    database DB as PostgreSQL Store

    Human->>Agent: Propose task: "Implement zero-trust auth middleware"
    Agent->>Gateway: POST /api/artifacts (Draft Skill)
    Gateway->>Engine: Validate schema & security tokens
    
    alt Policy Pass
        Engine->>DB: INSERT into artifacts (state='approved')
        Engine-->>Gateway: 201 Created (Artifact UUID)
        Gateway-->>Agent: Artifact saved successfully
        Agent-->>Human: "Skill created & verified"
    else Policy Review Required
        Engine->>DB: INSERT into artifacts (state='draft')
        Engine->>Engine: Enqueue Human Approval Event
        Engine-->>Gateway: 202 Accepted (Pending Review)
        Gateway-->>Agent: Artifact queued for human review
        Agent-->>Human: "Draft created — approval required in dashboard"
    end

    Note over Human,Gateway: Human approves changes via glass pill header
    Human->>Gateway: POST /api/artifacts/{id}/approve
    Gateway->>Engine: Transition state -> 'approved'
    Engine->>DB: UPDATE artifacts SET state='approved'
    DB-->>Engine: DB Row Updated
    Engine-->>Gateway: 200 OK
    Gateway-->>Human: UI Notification: "Artifact Approved"
\`\`\`

---

## 2. Backend API Contracts & Endpoints

Here is an example of the Django Ninja API endpoint contract with type hints and OpenAPI schemas:

\`\`\`python
from ninja import Router
from uuid import UUID
from .schemas import ArtifactSchema, ArtifactCreateSchema

router = Router(tags=["Artifacts"])

@router.get("/artifacts/{artifact_id}", response=ArtifactSchema)
def get_artifact(request, artifact_id: UUID):
    """Retrieve artifact details along with provenance metadata."""
    artifact = get_object_or_404(Artifact, id=artifact_id)
    return artifact
\`\`\`

---

## 3. Subtype Matrix & Governance

The table below outlines the core lifecycle states across artifact subtypes:

| Artifact Subtype | Purpose & Description | Default State | Review Strategy |
| :--- | :--- | :--- | :--- |
| \`Skill\` | Reusable agent tool or prompt workflow | \`approved\` | Automatic CI Validation |
| \`Decision\` | Architectural ADR and design rationale | \`draft\` | Human Peer Approval |
| \`Document\` | Structured knowledge sheet article | \`under_review\` | Semantic Graph Check |

---

## 4. Key Roadmap Tasks & Checklists

System implementation milestones:

- [x] High-performance SQLite & PostgreSQL storage using \`Django ORM\`
- [x] Auto-extracted [[Wiki-Link]] dependencies and relationship lineage
- [ ] Bring-Your-Own-Backend endpoint configuration with token auth
- [ ] Multi-agent collaborative memory graph

---

## 5. Architectural Diagram Asset

![System Architecture Overview](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80)

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

  let codeBlockCounter = 0;

  return (
    <div style={styles.container}>
      {/* Main Card (#292929) - Zero Radius, Zero Borders */}
      <div style={styles.card}>
        {/* Absolute Top-Left Back Chevron */}
        <button style={styles.backChevronBtn} title="Back">
          <ChevronLeft size={20} />
        </button>

        {/* Absolute Top-Right Glassmorphic Floating Header Action Tube Pill (Artifact Inspector Header) */}
        <div style={styles.glassHeaderActionTube}>
          {/* Status Indicator */}
          <div style={styles.statusIndicator}>
            <span style={styles.statusDot} />
            <span style={styles.statusText}>Approved</span>
          </div>

          {/* Activity Stat Badge */}
          <div style={styles.activityBadge} title="26 Relationships • 8 References">
            <span style={{ color: tokens.colors.textSecondary, fontSize: '12px' }}>Rel: 26</span>
          </div>

          {/* Diff Stat Button inside Pill */}
          <button
            onClick={() => setShowDiff(!showDiff)}
            style={styles.tubeDiffBtn}
            title="Toggle Line Diffs"
          >
            <span style={{ color: tokens.colors.textSecondary, fontSize: '12px', fontWeight: '500' }}>v3</span>
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
                  h2: ({ children }) => {
                    const text = String(children);
                    let id = 'core-system-architecture--lore-contracts';
                    if (text.includes('1')) id = '1-core-architecture-flow';
                    else if (text.includes('2')) id = '2-backend-api-contracts--endpoints';
                    else if (text.includes('3')) id = '3-subtype-matrix--governance';
                    else if (text.includes('4')) id = '4-key-roadmap-tasks--checklists';
                    else if (text.includes('5')) id = '5-architectural-diagram-asset';
                    return (
                      <h2 id={id} style={styles.heading2}>
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => (
                    <h3 style={styles.heading3}>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p style={styles.paragraph}>
                      {React.Children.map(children, (child) =>
                        typeof child === 'string' ? renderContentWithWikiLinks(child) : child
                      )}
                    </p>
                  ),
                  // Lore Custom Semantic Callout Renderer (Principle, Decision, Insight, Context)
                  blockquote: ({ children }: any) => {
                    const childArray = React.Children.toArray(children);
                    const firstChild = childArray[0];
                    let textContent = '';
                    if (typeof firstChild === 'string') {
                      textContent = firstChild;
                    } else if (firstChild && typeof firstChild === 'object' && 'props' in firstChild) {
                      const grandChild = (firstChild as any).props?.children;
                      if (typeof grandChild === 'string') textContent = grandChild;
                      else if (Array.isArray(grandChild)) textContent = grandChild.join('');
                    }

                    if (textContent.includes('[!PRINCIPLE]')) {
                      return (
                        <div style={styles.principleBlock}>
                          <div style={styles.semanticHeader}>
                            <ShieldCheck size={14} style={{ color: '#10b981', marginRight: '6px' }} />
                            <span style={{ ...styles.semanticTitle, color: '#10b981' }}>PRINCIPLE</span>
                          </div>
                          <div>{children}</div>
                        </div>
                      );
                    }

                    if (textContent.includes('[!DECISION]')) {
                      return (
                        <div style={styles.decisionBlock}>
                          <div style={styles.semanticHeader}>
                            <Bookmark size={14} style={{ color: '#38bdf8', marginRight: '6px' }} />
                            <span style={{ ...styles.semanticTitle, color: '#38bdf8' }}>DECISION</span>
                          </div>
                          <div>{children}</div>
                        </div>
                      );
                    }

                    if (textContent.includes('[!INSIGHT]')) {
                      return (
                        <div style={styles.insightBlock}>
                          <div style={styles.semanticHeader}>
                            <Sparkles size={14} style={{ color: '#f59e0b', marginRight: '6px' }} />
                            <span style={{ ...styles.semanticTitle, color: '#f59e0b' }}>ARTIFACT INSIGHT</span>
                          </div>
                          <div>{children}</div>
                        </div>
                      );
                    }

                    return <blockquote style={styles.blockquote}>{children}</blockquote>;
                  },
                  hr: () => <hr style={styles.hr} />,
                  ul: ({ children }) => <ul style={styles.ul}>{children}</ul>,
                  ol: ({ children }) => <ol style={styles.ol}>{children}</ol>,
                  li: ({ children }) => (
                    <li style={styles.li}>
                      {React.Children.map(children, (child) =>
                        typeof child === 'string' ? renderContentWithWikiLinks(child) : child
                      )}
                    </li>
                  ),
                  img: ({ src, alt }) => (
                    <figure style={styles.figure}>
                      <img src={src} alt={alt} style={styles.image} />
                      {alt && <figcaption style={styles.figcaption}>{alt}</figcaption>}
                    </figure>
                  ),
                  code: ({ inline, className, children }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const lang = match ? match[1] : '';
                    const rawCode = String(children).replace(/\n$/, '');

                    if (lang === 'mermaid') {
                      return <MermaidRenderer chart={rawCode} />;
                    }

                    if (inline) {
                      return <code style={styles.inlineCode}>{children}</code>;
                    }

                    const codeIndex = codeBlockCounter++;
                    const isCopied = copiedCodeIndex === codeIndex;

                    return (
                      <div style={styles.codeContainer}>
                        <div style={styles.codeHeader}>
                          <span style={styles.codeLang}>{lang || 'code'}</span>
                          <button
                            onClick={() => handleCopyCode(rawCode, codeIndex)}
                            style={styles.copyBtn}
                            title="Copy code"
                          >
                            {isCopied ? (
                              <Check size={13} style={{ color: '#10b981', marginRight: '4px' }} />
                            ) : (
                              <Copy size={13} style={{ marginRight: '4px' }} />
                            )}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre style={styles.codeBlock}>
                          <code>{rawCode}</code>
                        </pre>
                      </div>
                    );
                  },
                  table: ({ children }) => <table style={styles.table}>{children}</table>,
                  th: ({ children }) => <th style={styles.th}>{children}</th>,
                  tr: ({ children }) => <tr style={styles.tr}>{children}</tr>,
                  td: ({ children }) => <td style={styles.td}>{children}</td>,
                }}
              >
                {sanitizedHtml}
              </ReactMarkdown>
            )}
          </div>
        </div>

        {/* Expanded Signature Provenance & Lineage Footer ("Unmistakably Lore") */}
        <div style={styles.loreProvenanceFooter}>
          <div style={styles.footerLineDivider} />
          
          <div style={styles.provenanceGrid}>
            <div style={styles.provenanceItem}>
              <span style={styles.provenanceLabel}>Collection</span>
              <span style={styles.provenanceVal}>Projects / Lore</span>
            </div>

            <div style={styles.provenanceItem}>
              <span style={styles.provenanceLabel}>Derived From</span>
              <span style={styles.provenanceVal}>PRD Lore v2</span>
            </div>

            <div style={styles.provenanceItem}>
              <span style={styles.provenanceLabel}>References</span>
              <span style={styles.provenanceVal}>Artifact Schema • ADR-004</span>
            </div>

            <div style={styles.provenanceItem}>
              <span style={styles.provenanceLabel}>Produced By</span>
              <span style={styles.provenanceVal}>Architecture Agent</span>
            </div>

            <div style={styles.provenanceItem}>
              <span style={styles.provenanceLabel}>Approved By</span>
              <span style={{ ...styles.provenanceVal, color: '#3fb950' }}>Wisdom</span>
            </div>

            <div style={styles.provenanceItem}>
              <span style={styles.provenanceLabel}>Version</span>
              <span style={styles.provenanceBadge}>v3</span>
            </div>
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
    padding: '6px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 10,
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 6px #10b981',
  },
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
  },
  activityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '4px 10px',
    borderRadius: tokens.radii.pill,
    display: 'flex',
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
    padding: '8px 18px',
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
    marginTop: '36px',
    marginBottom: '16px',
  },
  heading3: {
    fontSize: tokens.typography.h3.fontSize,
    fontWeight: tokens.typography.h3.fontWeight,
    color: tokens.colors.textPrimary,
    marginTop: '28px',
    marginBottom: '14px',
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
    padding: '14px 20px',
    borderRadius: '0 8px 8px 0',
    color: tokens.colors.textPrimary,
    fontSize: '15px',
    fontStyle: 'italic',
    marginBottom: '28px',
  },
  semanticHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '6px',
  },
  semanticTitle: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  principleBlock: {
    borderLeft: '3px solid #10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: '14px 20px',
    borderRadius: '0 8px 8px 0',
    color: tokens.colors.textPrimary,
    fontSize: '14px',
    marginBottom: '28px',
  },
  decisionBlock: {
    borderLeft: '3px solid #38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    padding: '14px 20px',
    borderRadius: '0 8px 8px 0',
    color: tokens.colors.textPrimary,
    fontSize: '14px',
    marginBottom: '28px',
  },
  insightBlock: {
    borderLeft: '3px solid #f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    padding: '14px 20px',
    borderRadius: '0 8px 8px 0',
    color: tokens.colors.textPrimary,
    fontSize: '14px',
    marginBottom: '28px',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    margin: '32px 0',
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
  figure: {
    marginBottom: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  image: {
    width: '100%',
    borderRadius: '10px',
    objectFit: 'cover',
    maxHeight: '380px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  figcaption: {
    fontSize: '12px',
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inlineCode: {
    backgroundColor: '#202024',
    color: '#38bdf8',
    padding: '2px 6px',
    borderRadius: tokens.radii.sm,
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '14px',
  },
  codeContainer: {
    backgroundColor: '#18181c',
    border: '1px solid #333338',
    borderRadius: tokens.radii.sm,
    marginBottom: '28px',
    overflow: 'hidden',
  },
  codeHeader: {
    backgroundColor: '#202024',
    padding: '8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #333338',
  },
  codeLang: {
    fontSize: '12px',
    fontWeight: '600',
    color: tokens.colors.textSecondary,
    textTransform: 'uppercase',
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    color: tokens.colors.textSecondary,
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  codeBlock: {
    padding: '16px',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '14px',
    lineHeight: '1.6',
    color: tokens.colors.textPrimary,
    overflowX: 'auto',
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '24px',
    marginBottom: '32px',
    fontSize: '14px',
  },
  th: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  td: {
    padding: '14px 16px',
    color: tokens.colors.textPrimary,
    fontSize: '14px',
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
  loreProvenanceFooter: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '16px',
    paddingBottom: '8px',
    flexShrink: 0,
    width: '100%',
  },
  footerLineDivider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: '16px',
    width: '100%',
  },
  provenanceGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: tokens.colors.textSecondary,
    gap: '12px',
    flexWrap: 'wrap',
  },
  provenanceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  provenanceLabel: {
    color: '#888888',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  provenanceVal: {
    color: '#e4e4e7',
    fontWeight: '500',
  },
  provenanceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '10px',
  },
};
