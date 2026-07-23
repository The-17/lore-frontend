import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { ChevronLeft, ArrowLeft, Copy, Check, Info, X, GitCommit } from 'lucide-react';
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
        const tokensList = line.split(/(\s+|[(),:[\]"'])/);
        lineContent = tokensList.map((token, tokIdx) => {
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
  const [isRejectHovered, setIsRejectHovered] = useState(false);
  const [isApproveHovered, setIsApproveHovered] = useState(false);

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const markdownText = `Lorem ipsum dolor sit amet, **consectetur adipiscing elit**. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. See [[Django Ninja Patterns]] for API schemas, ==zero-trust token authentication==, and [[Agent Token Security]] for auth headers.

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
`;

  const parseRichInlineMarkdown = (text: string) => {
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

  const sampleGitHubDiff = [
    { type: 'header', text: '@@ -4,6 +4,8 @@' },
    { type: 'deletion', text: '- Standardized API routes will use DRF endpoints.' },
    { type: 'addition', text: '+ Standardized API routes will reference [[Django Ninja Patterns]] for all error handling.' },
    { type: 'addition', text: '+ Authentication middleware will resolve both JWT Bearer tokens and [[Agent Token Security]] headers.' },
  ];

  let codeBlockCounter = 0;

  return (
    <div style={styles.container}>
      {/* FLOATING SEPARATE BACK BUTTON */}
      <button style={styles.floatingBackBtn} title="Back">
        <ChevronLeft size={16} />
      </button>

      {/* FLOATING SEPARATE ACTION TUBE PILL */}
      <div style={styles.floatingActionTube}>
        <button
          onClick={() => setIsInfoOpen(true)}
          style={styles.infoPillBtn}
          title="Inspect Artifact Object Details"
        >
          <Info size={14} style={{ color: '#a1a1aa' }} />
        </button>

        <button
          onClick={() => setShowDiff(!showDiff)}
          style={styles.tubeDiffBtn}
          title="Toggle Line Diffs"
        >
          <GitCommit size={13} style={{ color: '#a1a1aa', marginRight: '3px' }} />
          <span style={{ color: '#a1a1aa', fontSize: '12px', fontWeight: '500' }}>v3</span>
          <span style={styles.addStatBadge}>+12</span>
          <span style={styles.delStatBadge}>-3</span>
        </button>

        {approvalStatus === 'draft' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setApprovalStatus('rejected')}
              onMouseEnter={() => setIsRejectHovered(true)}
              onMouseLeave={() => setIsRejectHovered(false)}
              style={{
                ...styles.bubblyActionBtn,
                ...(isRejectHovered ? styles.hoveredRejectBtn : styles.restActionBtn),
              }}
              title="Reject artifact changes"
            >
              <X size={14} style={{ flexShrink: 0 }} />
              <span
                style={{
                  ...styles.bubblyText,
                  ...(isRejectHovered ? styles.bubblyTextVisible : styles.bubblyTextHidden),
                }}
              >
                Reject
              </span>
            </button>

            <button
              onClick={() => setApprovalStatus('approved')}
              onMouseEnter={() => setIsApproveHovered(true)}
              onMouseLeave={() => setIsApproveHovered(false)}
              style={{
                ...styles.bubblyActionBtn,
                ...(isApproveHovered ? styles.hoveredApproveBtn : styles.restActionBtn),
              }}
              title="Approve artifact changes"
            >
              <Check size={14} style={{ flexShrink: 0 }} />
              <span
                style={{
                  ...styles.bubblyText,
                  ...(isApproveHovered ? styles.bubblyTextVisible : styles.bubblyTextHidden),
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

      {/* FULL CANVAS READING AREA — STARTS LOWER WITH SPACED TITLE HEADER */}
      <div style={styles.fullCanvasScrollArea}>
        <div style={styles.centerColumn}>
          <div style={styles.body}>
            
            {/* QUIET CANVAS HEADER — LOWER TOP MARGIN & GENEROUS BOTTOM SPACING */}
            <div style={styles.canvasHeader}>
              <h1 style={styles.mainTitle}>System Architecture & Lore Contracts</h1>

              {/* Single-Line Property Strip containing Subtype, Lifecycle State, Attribution, & ID */}
              <div style={styles.quietPropertyStrip}>
                <span style={styles.subtypeLabel}>Decision</span>

                <span style={styles.propDot}>•</span>
                <span
                  style={{
                    ...styles.inlineStateChip,
                    ...(approvalStatus === 'approved'
                      ? styles.approvedChip
                      : approvalStatus === 'rejected'
                      ? styles.rejectedChip
                      : styles.draftChip),
                  }}
                >
                  {approvalStatus.toUpperCase()}
                </span>

                <span style={styles.propDot}>•</span>
                <span style={styles.propVal}>Created by Architecture Agent</span>

                <span style={styles.propDot}>•</span>
                <span style={styles.propVal}>Owner: Wisdom</span>

                <span style={styles.propDot}>•</span>
                <code style={styles.propCode}>7087ed86</code>
              </div>
            </div>

            {showDiff ? (
              <div style={styles.githubDiffViewer}>
                <div style={styles.diffHeaderBar}>
                  <button onClick={() => setShowDiff(false)} style={styles.backToDocBtn}>
                    <ArrowLeft size={14} style={{ marginRight: '6px' }} /> Return to Content
                  </button>
                  <span style={{ color: '#8b949e', fontSize: '12px' }}>Unified Line Diff View</span>
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
                  code: ({ inline, className, children }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const lang = match ? match[1] : '';
                    const rawCode = String(children).replace(/\n$/, '');

                    if (lang === 'mermaid') {
                      return <MermaidRenderer chart={rawCode} />;
                    }

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

        {/* Minimal Lineage Footer */}
        <div style={styles.footerRow}>
          <div style={styles.footerCenterItem}>
            <span style={styles.footerLabel}>Derived from:</span>
            <span style={styles.footerValue}>[PRD Lore v2]</span>
          </div>

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
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#242424',
  },
  floatingBackBtn: {
    position: 'absolute',
    top: '24px',
    left: '32px',
    zIndex: 20,
    background: 'none',
    border: 'none',
    color: '#71717a',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingActionTube: {
    position: 'absolute',
    top: '24px',
    right: '32px',
    zIndex: 20,
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '20px',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  infoPillBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
    borderRadius: '6px',
  },
  tubeDiffBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    padding: '4px 6px',
    borderRadius: '4px',
  },
  addStatBadge: {
    color: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    padding: '2px 5px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: '600',
  },
  delStatBadge: {
    color: '#f87171',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    padding: '2px 5px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: '600',
  },
  bubblyActionBtn: {
    border: '1px solid #3f3f46',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 7px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  restActionBtn: {
    backgroundColor: '#27272a',
    color: '#a1a1aa',
  },
  hoveredRejectBtn: {
    backgroundColor: '#7f1d1d',
    color: '#fca5a5',
    borderColor: '#991b1b',
    padding: '4px 10px',
  },
  hoveredApproveBtn: {
    backgroundColor: '#ffffff',
    color: '#000000',
    borderColor: '#ffffff',
    padding: '4px 12px',
  },
  bubblyText: {
    fontSize: '12px',
    fontWeight: '600',
    transition: 'max-width 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, margin-left 0.25s ease',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  bubblyTextHidden: {
    maxWidth: '0px',
    opacity: 0,
    marginLeft: '0px',
  },
  bubblyTextVisible: {
    maxWidth: '140px',
    opacity: 1,
    marginLeft: '4px',
  },
  tubeResetBtn: {
    backgroundColor: '#27272a',
    border: '1px solid #3f3f46',
    color: '#a1a1aa',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  fullCanvasScrollArea: {
    width: '100%',
    height: '100vh',
    padding: '0px 48px 16px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: '#242424',
  },
  centerColumn: {
    flex: 1,
    maxWidth: '720px',
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
    paddingTop: '64px',
  },
  canvasHeader: {
    marginBottom: '52px',
  },
  mainTitle: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#f4f4f5',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
  },
  quietPropertyStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#71717a',
  },
  subtypeLabel: {
    color: '#a1a1aa',
    fontWeight: '500',
  },
  inlineStateChip: {
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.6px',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  draftChip: {
    color: '#a1a1aa',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  approvedChip: {
    color: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    border: '1px solid rgba(74, 222, 128, 0.25)',
  },
  rejectedChip: {
    color: '#f87171',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    border: '1px solid rgba(248, 113, 113, 0.25)',
  },
  propVal: {
    color: '#71717a',
    fontWeight: '400',
  },
  propCode: {
    fontFamily: 'monospace',
    color: '#71717a',
    fontSize: '12px',
  },
  propDot: {
    color: '#3f3f46',
  },
  heading1: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#f4f4f5',
    marginTop: '28px',
    marginBottom: '16px',
  },
  heading2: {
    fontSize: '19px',
    fontWeight: '600',
    color: '#f4f4f5',
    marginTop: '28px',
    marginBottom: '14px',
  },
  heading3: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f4f4f5',
    marginTop: '22px',
    marginBottom: '12px',
  },
  paragraph: {
    fontSize: '15px',
    lineHeight: '1.75',
    color: '#d4d4d8',
    marginBottom: '24px',
  },
  blockquote: {
    borderLeft: '2px solid #f4f4f5',
    backgroundColor: '#18181b',
    padding: '12px 18px',
    borderRadius: '0 4px 4px 0',
    color: '#e4e4e7',
    fontSize: '14px',
    fontStyle: 'italic',
    marginBottom: '28px',
    border: '1px solid #27272a',
    borderLeftColor: '#f4f4f5',
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
    borderTop: '1px solid #27272a',
    margin: '32px 0',
  },
  ul: {
    marginBottom: '24px',
    paddingLeft: '24px',
    color: '#d4d4d8',
  },
  ol: {
    marginBottom: '24px',
    paddingLeft: '24px',
    color: '#d4d4d8',
  },
  li: {
    fontSize: '15px',
    lineHeight: '1.75',
    marginBottom: '8px',
  },
  inlineCode: {
    backgroundColor: '#18181b',
    color: '#f4f4f5',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '13px',
    border: '1px solid #27272a',
  },
  codeContainer: {
    backgroundColor: '#09090b',
    border: '1px solid #27272a',
    borderRadius: '8px',
    marginBottom: '28px',
    overflow: 'hidden',
  },
  codeHeader: {
    backgroundColor: '#18181b',
    padding: '8px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #27272a',
  },
  codeLangBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#a1a1aa',
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
    color: '#a1a1aa',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  codeBlock: {
    padding: '14px 16px',
    fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Consolas, monospace",
    fontSize: '13px',
    lineHeight: '1.65',
    color: '#e4e4e7',
    overflowX: 'auto',
    margin: 0,
  },
  tableWrapper: {
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '8px',
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
    backgroundColor: '#202024',
    color: '#f4f4f5',
    textAlign: 'left',
    padding: '10px 14px',
    borderBottom: '1px solid #27272a',
    fontWeight: '600',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  tr: {
    borderBottom: '1px solid #27272a',
  },
  td: {
    padding: '12px 14px',
    color: '#d4d4d8',
    fontSize: '13px',
  },
  githubDiffViewer: {
    backgroundColor: '#09090b',
    borderRadius: '8px',
    border: '1px solid #27272a',
    padding: '18px',
    marginTop: '20px',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#e4e4e7',
  },
  diffHeaderBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    paddingBottom: '10px',
    borderBottom: '1px solid #27272a',
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
    padding: '6px 10px',
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
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    color: '#4ade80',
  },
  deletionLine: {
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    color: '#f87171',
  },
  headerLine: {
    backgroundColor: '#27272a',
    color: '#f4f4f5',
    fontStyle: 'italic',
  },
  footerRow: {
    display: 'flex',
    alignItems: 'center',
    fontSize: tokens.typography.caption.fontSize,
    paddingTop: '12px',
    paddingBottom: '4px',
    borderTop: '1px solid #27272a',
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
    color: '#71717a',
    fontSize: '12px',
  },
  footerValue: {
    color: '#f4f4f5',
    fontWeight: '500',
    fontSize: '12px',
  },
  countBadge: {
    backgroundColor: '#27272a',
    color: '#a1a1aa',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '8px',
  },
};
