import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { ChevronLeft, ArrowLeft, Copy, Check, Info, X } from 'lucide-react';
import { tokens } from '../design-system/tokens';
import { WikiLink } from './WikiLink';
import { MermaidRenderer } from './MermaidRenderer';
import { ArtifactInfoModal } from './ArtifactInfoModal';

interface ArtifactCanvasProps {
  artifact?: any;
  versions?: any[];
  relationships?: any[];
  onBack?: () => void;
  onSelectWikiLink?: (title: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

// Lightweight Syntax Highlighter for code blocks
const renderSyntaxHighlightedCode = (rawCode: string, lang: string) => {
  const lines = rawCode.split('\n');

  return lines.map((line, lineIdx) => {
    let lineContent: React.ReactNode = line;

    if (lang === 'python') {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || trimmed.startsWith('"""')) {
        lineContent = <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;
      } else {
        // Simple Python tokenizer for syntax highlighting
        const tokens = line.split(/(\s+|[(),:[\]"'])/);
        lineContent = tokens.map((token, tokIdx) => {
          if (['from', 'import', 'def', 'return', 'class', 'if', 'else', 'try', 'except', 'with', 'as', 'for', 'in'].includes(token)) {
            return <span key={tokIdx} style={{ color: '#f472b6', fontWeight: '500' }}>{token}</span>;
          }
          if (['True', 'False', 'None', 'UUID', 'Router', 'ArtifactSchema', 'ArtifactCreateSchema'].includes(token)) {
            return <span key={tokIdx} style={{ color: '#38bdf8', fontWeight: '500' }}>{token}</span>;
          }
          if (token.startsWith('@')) {
            return <span key={tokIdx} style={{ color: '#a78bfa' }}>{token}</span>;
          }
          if (token.startsWith('"') || token.startsWith("'")) {
            return <span key={tokIdx} style={{ color: '#a7f3d0' }}>{token}</span>;
          }
          if (['get_artifact', 'get_object_or_404'].includes(token)) {
            return <span key={tokIdx} style={{ color: '#60a5fa' }}>{token}</span>;
          }
          return <span key={tokIdx}>{token}</span>;
        });
      }
    }

    return (
      <div key={lineIdx} style={{ display: 'flex', minHeight: '22px' }}>
        <span
          style={{
            userSelect: 'none',
            width: '28px',
            color: '#4b5563',
            fontSize: '11px',
            textAlign: 'right',
            paddingRight: '12px',
            flexShrink: 0,
          }}
        >
          {lineIdx + 1}
        </span>
        <span style={{ flex: 1, whiteSpace: 'pre' }}>{lineContent}</span>
      </div>
    );
  });
};

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({ onSelectWikiLink }) => {
  const [showDiff, setShowDiff] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'draft' | 'approved' | 'rejected'>('draft');
  const [hoveredAction, setHoveredAction] = useState<'approve' | 'reject' | null>(null);

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Comprehensive Demo Markdown Content covering ALL markdown features including ==highlight==
  const markdownText = `# System Architecture & Lore Contracts

Lorem ipsum dolor sit amet, **consectetur adipiscing elit**. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. See [[Django Ninja Patterns]] for API schemas, ==zero-trust token authentication==, and [[Agent Token Security]] for auth headers.

> Lore serves as the Artifact Plane for Humans and AI Agents, unifying persistent storage, ==semantic vector search==, and human-in-the-loop governance.

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

  // Parser for both WikiLinks [[Title]] and Highlighted Text ==Text==
  const parseRichInlineMarkdown = (text: string) => {
    // First split by WikiLinks
    const wikiParts = text.split(/(\[\[.*?\]\])/g);
    
    return wikiParts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const title = part.slice(2, -2);
        return (
          <WikiLink
            key={`wiki-${i}`}
            title={title}
            onNavigate={onSelectWikiLink}
          />
        );
      }
      
      // Next split non-wiki string by ==highlight==
      const highlightParts = part.split(/(==.*?==)/g);
      return highlightParts.map((subPart, j) => {
        if (subPart.startsWith('==') && subPart.endsWith('==')) {
          const highlightText = subPart.slice(2, -2);
          return (
            <mark key={`mark-${i}-${j}`} style={styles.markHighlight}>
              {highlightText}
            </mark>
          );
        }
        return subPart;
      });
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

        {/* Absolute Top-Right Glassmorphic Floating Header Action Tube Pill */}
        <div style={styles.glassHeaderActionTube}>
          {/* 1. Info Button First */}
          <button
            onClick={() => setIsInfoOpen(true)}
            style={styles.infoPillBtn}
            title="Inspect Artifact Object Details (Lineage, Governance, Metrics)"
          >
            <Info size={14} style={{ color: tokens.colors.textSecondary }} />
          </button>

          {/* 2. Status Badge */}
          <span
            style={{
              ...styles.subtleDraftBadge,
              ...(approvalStatus === 'approved'
                ? styles.approvedBadge
                : approvalStatus === 'rejected'
                ? styles.rejectedBadge
                : {}),
            }}
          >
            {approvalStatus === 'approved' ? 'Approved' : approvalStatus === 'rejected' ? 'Rejected' : 'Draft'}
          </span>

          {/* 3. Diff Stat Button inside Pill */}
          <button
            onClick={() => setShowDiff(!showDiff)}
            style={styles.tubeDiffBtn}
            title="Toggle Line Diffs"
          >
            <span style={{ color: tokens.colors.textSecondary, fontSize: '13px', fontWeight: '500' }}>v3</span>
            <span style={styles.addStatBadge}>+12</span>
            <span style={styles.delStatBadge}>-3</span>
          </button>

          {/* Bubbly Micro-Interaction Governance Action Buttons */}
          {approvalStatus === 'draft' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Reject Icon-to-Text Expansion Button */}
              <button
                onClick={() => setApprovalStatus('rejected')}
                onMouseEnter={() => setHoveredAction('reject')}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  ...styles.bubblyActionBtn,
                  ...(hoveredAction === 'reject' ? styles.hoveredRejectBtn : styles.restActionBtn),
                }}
                title="Reject artifact changes"
              >
                <X size={14} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    ...styles.bubblyText,
                    ...(hoveredAction === 'reject' ? styles.bubblyTextVisible : styles.bubblyTextHidden),
                  }}
                >
                  Reject
                </span>
              </button>

              {/* Approve Icon-to-Text Expansion Button */}
              <button
                onClick={() => setApprovalStatus('approved')}
                onMouseEnter={() => setHoveredAction('approve')}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  ...styles.bubblyActionBtn,
                  ...(hoveredAction === 'approve' ? styles.hoveredApproveBtn : styles.restActionBtn),
                }}
                title="Approve artifact changes"
              >
                <Check size={14} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    ...styles.bubblyText,
                    ...(hoveredAction === 'approve' ? styles.bubblyTextVisible : styles.bubblyTextHidden),
                  }}
                >
                  Approve changes
                </span>
              </button>
            </div>
          )}

          {approvalStatus !== 'draft' && (
            <button
              onClick={() => setApprovalStatus('draft')}
              style={styles.tubeResetBtn}
              title="Reset approval state back to Draft"
            >
              Reopen review
            </button>
          )}
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
                        typeof child === 'string' ? parseRichInlineMarkdown(child) : child
                      )}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={styles.blockquote}>{children}</blockquote>
                  ),
                  mark: ({ children }) => (
                    <mark style={styles.markHighlight}>{children}</mark>
                  ),
                  hr: () => <hr style={styles.hr} />,
                  ul: ({ children }) => <ul style={styles.ul}>{children}</ul>,
                  ol: ({ children }) => <ol style={styles.ol}>{children}</ol>,
                  li: ({ children }) => (
                    <li style={styles.li}>
                      {React.Children.map(children, (child) =>
                        typeof child === 'string' ? parseRichInlineMarkdown(child) : child
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

                    // A code block has a language class OR multiline text. Single-line backticked words (e.g. inside tables) are inline code.
                    const isMultiLine = rawCode.includes('\n');
                    const isInlineCode = inline || (!match && !isMultiLine);

                    if (isInlineCode) {
                      return <code style={styles.inlineCode}>{children}</code>;
                    }

                    const codeIndex = codeBlockCounter++;
                    const isCopied = copiedCodeIndex === codeIndex;

                    return (
                      <div style={styles.codeContainer}>
                        <div style={styles.codeHeader}>
                          <div style={styles.codeLangBadge}>
                            <span style={styles.langDot} />
                            <span>{lang || 'code'}</span>
                          </div>
                          <button
                            onClick={() => handleCopyCode(rawCode, codeIndex)}
                            style={styles.copyBtn}
                            title="Copy code"
                          >
                            {isCopied ? (
                              <Check size={12} style={{ color: '#10b981', marginRight: '5px' }} />
                            ) : (
                              <Copy size={12} style={{ marginRight: '5px' }} />
                            )}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <div style={styles.codeBlock}>
                          {renderSyntaxHighlightedCode(rawCode, lang)}
                        </div>
                      </div>
                    );
                  },
                  table: ({ children }) => (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>{children}</table>
                    </div>
                  ),
                  th: ({ children }) => <th style={styles.th}>{children}</th>,
                  tr: ({ children }) => <tr style={styles.tr}>{children}</tr>,
                  td: ({ children }) => (
                    <td style={styles.td}>
                      {React.Children.map(children, (child) =>
                        typeof child === 'string' ? parseRichInlineMarkdown(child) : child
                      )}
                    </td>
                  ),
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

      {/* Artifact Info Modal */}
      <ArtifactInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onSelectRelatedArtifact={onSelectWikiLink}
      />
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
    top: '32px',
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
    top: '24px',
    backgroundColor: tokens.colors.bgGlass,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${tokens.colors.borderGlass}`,
    boxShadow: tokens.shadows.glass,
    borderRadius: tokens.radii.pill,
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
    transition: 'all 0.2s ease',
  },
  approvedBadge: {
    color: '#3fb950',
    backgroundColor: 'rgba(46, 160, 67, 0.15)',
    border: '1px solid rgba(46, 160, 67, 0.25)',
  },
  rejectedBadge: {
    color: '#f85149',
    backgroundColor: 'rgba(248, 81, 73, 0.15)',
    border: '1px solid rgba(248, 81, 73, 0.25)',
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
  infoPillBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transition: 'all 0.15s ease',
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
  bubblyActionBtn: {
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 9px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  restActionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: tokens.colors.textSecondary,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  hoveredRejectBtn: {
    backgroundColor: '#f85149',
    color: '#ffffff',
    border: '1px solid #f85149',
    padding: '6px 14px',
    boxShadow: '0 4px 14px rgba(248, 81, 73, 0.4)',
    transform: 'scale(1.05)',
  },
  hoveredApproveBtn: {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #ffffff',
    padding: '6px 16px',
    boxShadow: '0 4px 14px rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.05)',
  },
  bubblyText: {
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  bubblyTextHidden: {
    maxWidth: 0,
    opacity: 0,
    marginLeft: 0,
    display: 'none',
  },
  bubblyTextVisible: {
    maxWidth: '120px',
    opacity: 1,
    marginLeft: '6px',
    display: 'inline-block',
  },
  tubeResetBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: tokens.colors.textSecondary,
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
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
    paddingTop: '28px',
  },
  heading1: {
    fontSize: tokens.typography.h1.fontSize,
    fontWeight: tokens.typography.h1.fontWeight,
    color: tokens.colors.textPrimary,
    marginTop: '24px',
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
    borderLeft: '3px solid #ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '14px 20px',
    borderRadius: '0 8px 8px 0',
    color: tokens.colors.textPrimary,
    fontSize: '15px',
    fontStyle: 'italic',
    marginBottom: '28px',
  },
  markHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    fontWeight: '500',
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
    color: '#ffffff',
    padding: '2px 6px',
    borderRadius: tokens.radii.sm,
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '13px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },
  codeContainer: {
    backgroundColor: '#131316',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    marginBottom: '28px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  },
  codeHeader: {
    backgroundColor: '#161619',
    padding: '9px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  codeLangBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: '600',
    color: tokens.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  langDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    color: tokens.colors.textSecondary,
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.15s ease',
  },
  codeBlock: {
    padding: '16px 18px',
    fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Consolas, monospace",
    fontSize: '13px',
    lineHeight: '1.65',
    color: '#e4e4e7',
    overflowX: 'auto',
    margin: 0,
  },
  tableWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '28px',
    marginBottom: '32px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    color: '#ffffff',
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  td: {
    padding: '14px 16px',
    color: tokens.colors.textPrimary,
    fontSize: '14px',
  },
  githubDiffViewer: {
    backgroundColor: '#141417',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '20px',
    marginTop: '44px',
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#e4e4e7',
  },
  diffHeaderBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  backToDocBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
  },
  diffLinesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  diffLineRow: {
    padding: '6px 12px',
    borderRadius: '6px',
    display: 'flex',
    gap: '8px',
  },
  linePrefix: {
    userSelect: 'none',
    fontWeight: '700',
    width: '12px',
  },
  additionLine: {
    backgroundColor: 'rgba(46, 160, 67, 0.18)',
    color: '#3fb950',
  },
  deletionLine: {
    backgroundColor: 'rgba(248, 81, 73, 0.18)',
    color: '#f85149',
  },
  headerLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
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
