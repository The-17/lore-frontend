import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { ChevronLeft, ArrowLeft, Copy, Check, Info, X, GitCommit, Clock, Columns, AlignLeft, RotateCcw, Eye, ChevronDown, ChevronRight, Network } from 'lucide-react';
import { tokens } from '../design-system/tokens';
import { WikiLink } from './WikiLink';
import { MermaidRenderer } from './MermaidRenderer';
import { ArtifactInfoModal } from './ArtifactInfoModal';

interface ArtifactCanvasProps {
  artifact?: any;
  versions?: any[];
  relationships?: any[];
  isDiffOpen?: boolean;
  onToggleDiff?: (open: boolean) => void;
  onBack?: () => void;
  onSelectWikiLink?: (title: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

// Syntax Highlighter for code blocks
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
          if (['True', 'False', 'None', 'UUID', 'Router', 'ArtifactSchema', 'ArtifactCreateSchema', 'ArtifactRevertSchema'].includes(token)) {
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

// Interactive Task Checkbox Component for Markdown Checklists
const TaskCheckbox: React.FC<{ checked?: boolean }> = ({ checked: initialChecked }) => {
  const [isChecked, setIsChecked] = useState(initialChecked || false);

  useEffect(() => {
    setIsChecked(initialChecked || false);
  }, [initialChecked]);

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsChecked(!isChecked);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '15px',
        height: '15px',
        borderRadius: '4px',
        border: isChecked ? '1px solid #4ade80' : '1px solid #71717a',
        backgroundColor: isChecked ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 255, 255, 0.04)',
        cursor: 'pointer',
        marginRight: '8px',
        verticalAlign: 'middle',
        userSelect: 'none',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
      role="checkbox"
      aria-checked={isChecked}
    >
      {isChecked && <Check size={10} style={{ color: '#4ade80', strokeWidth: 3 }} />}
    </span>
  );
};

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({
  isDiffOpen: propIsDiffOpen,
  onToggleDiff,
  onSelectWikiLink,
}) => {
  const [showDiff, setShowDiff] = useState(propIsDiffOpen || false);
  const [diffMode, setDiffMode] = useState<'unified' | 'split'>('unified');
  const [showDiagramDiff, setShowDiagramDiff] = useState(true);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'draft' | 'approved' | 'rejected'>('draft');
  const [isRejectHovered, setIsRejectHovered] = useState(false);
  const [isApproveHovered, setIsApproveHovered] = useState(false);
  const [restoreNotification, setRestoreNotification] = useState<string | null>(null);

  useEffect(() => {
    if (propIsDiffOpen !== undefined) {
      setShowDiff(propIsDiffOpen);
    }
  }, [propIsDiffOpen]);

  const toggleDiffState = (newVal: boolean) => {
    setShowDiff(newVal);
    if (onToggleDiff) {
      onToggleDiff(newVal);
    }
  };

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleRevertVersion = (ver: string) => {
    setRestoreNotification(`Reverted to ${ver} — appended snapshot as new forward draft v4`);
    setTimeout(() => setRestoreNotification(null), 4000);
  };

  const markdownText = `Lore operates on a fundamental architectural paradigm known as the **Artifact Plane**. Unlike conventional document editors or unstructured knowledge bases, an artifact in Lore is a durable, immutable, version-controlled entity equipped with cryptographic attribution, explicit dependency lineage, and deterministic state transitions. Every modification created by either human principals or autonomous AI coding agents produces an incremental state snapshot, preventing silent regressions and guaranteeing long-term system auditability across complex multi-agent engineering workflows.

By decoupling the high-frequency execution context of autonomous AI agents from the persistent governing state of the codebase, Lore ensures that architectural decisions, reusable execution tools, and system contracts remain pristine. When an agent proposes structural changes to system endpoints or security protocols, those modifications are wrapped as draft artifacts, enqueued for peer inspection, and governed through explicit human-in-the-loop review cycles before hitting production environments. See [[Django Ninja Patterns]] for API schemas, ==zero-trust token authentication==, and [[Agent Token Security]] for auth headers.

> Lore serves as the Artifact Plane for Humans and AI Agents, unifying persistent storage, ==semantic vector search==, and human-in-the-loop governance across distributed development teams.

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

The core integration layer communicates over strict, typed HTTP interfaces backed by Django Ninja schemas. This architecture enables low-latency streaming of real-time SSE collaboration events, allowing human developers and background agent workers to observe state updates synchronously without long-polling overhead or race conditions:

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

System persistence relies on relational graph storage wherein every artifact maintains explicit outgoing and incoming references. When an artifact is updated or superseded by a newer version, the lineage graph automatically re-links descendant objects, maintaining complete historical tracebacks and preventing orphaned knowledge nodes.

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

  // Bulky multi-chunk realistic diff dataset for testing diff features
  const bulkyDiffData = [
    // HUNK 1: Section 1 Architectural Paradigm
    { id: 'diff-chunk-1', type: 'header', text: '@@ -4,12 +4,16 @@ Hunk 1: Architectural Paradigm & Auth Rules' },
    { type: 'context', text: 'Lore operates on a fundamental architectural paradigm known as the Artifact Plane.', leftNum: 4, rightNum: 4 },
    { type: 'deletion', text: '- Standardized API routes will use legacy DRF endpoints.', leftNum: 5, rightNum: null, wordHighlight: 'legacy DRF endpoints' },
    { type: 'addition', text: '+ Standardized API routes will reference [[Django Ninja Patterns]] for all error handling and router schemas.', leftNum: null, rightNum: 5, wordHighlight: '[[Django Ninja Patterns]] for all error handling' },
    { type: 'addition', text: '+ Authentication middleware will resolve both JWT Bearer tokens and [[Agent Token Security]] headers deterministically.', leftNum: null, rightNum: 6, wordHighlight: 'JWT Bearer tokens and [[Agent Token Security]]' },
    { type: 'context', text: 'By decoupling the high-frequency execution context of autonomous AI agents...', leftNum: 6, rightNum: 7 },
    { type: 'deletion', text: '- Policy verification checks are executed asynchronously once per day.', leftNum: 7, rightNum: null, wordHighlight: 'asynchronously once per day' },
    { type: 'addition', text: '+ Policy verification checks execute deterministically on every agent artifact proposal.', leftNum: null, rightNum: 8, wordHighlight: 'deterministically on every agent artifact proposal' },

    // HUNK 2: Section 2 Sequence Diagram
    { id: 'diff-chunk-2', type: 'header', text: '@@ -24,9 +28,15 @@ Hunk 2: Mermaid Sequence Diagram Flow' },
    { type: 'context', text: '```mermaid', leftNum: 24, rightNum: 28 },
    { type: 'deletion', text: '-     Agent->>Gateway: POST /api/artifacts', leftNum: 25, rightNum: null, wordHighlight: '/api/artifacts' },
    { type: 'addition', text: '+     Agent->>Gateway: POST /api/v1/artifacts (Draft Skill Payload)', leftNum: null, rightNum: 29, wordHighlight: '/api/v1/artifacts (Draft Skill Payload)' },
    { type: 'deletion', text: '-     Gateway->>Engine: Validate schema', leftNum: 26, rightNum: null, wordHighlight: 'Validate schema' },
    { type: 'addition', text: '+     Gateway->>Engine: Validate schema & cryptographic token headers', leftNum: null, rightNum: 30, wordHighlight: 'cryptographic token headers' },
    { type: 'context', text: '```', leftNum: 27, rightNum: 31 },

    // HUNK 3: Section 3 API Router Python Code
    { id: 'diff-chunk-3', type: 'header', text: '@@ -42,10 +52,18 @@ Hunk 3: Python Router Schema & Endpoints' },
    { type: 'context', text: 'from ninja import Router', leftNum: 42, rightNum: 52 },
    { type: 'deletion', text: '- from .schemas import ArtifactSchema', leftNum: 43, rightNum: null, wordHighlight: 'ArtifactSchema' },
    { type: 'addition', text: '+ from .schemas import ArtifactSchema, ArtifactCreateSchema, ArtifactRevertSchema', leftNum: null, rightNum: 53, wordHighlight: 'ArtifactRevertSchema' },
    { type: 'context', text: 'router = Router(tags=["Artifacts"])', leftNum: 44, rightNum: 54 },
    { type: 'deletion', text: '- @router.get("/artifacts/{artifact_id}", response=ArtifactSchema)', leftNum: 45, rightNum: null, wordHighlight: '/artifacts/{artifact_id}' },
    { type: 'addition', text: '+ @router.get("/artifacts/{artifact_id}", response=ArtifactSchema, auth=JWTBearer())', leftNum: null, rightNum: 55, wordHighlight: 'auth=JWTBearer()' },
    { type: 'addition', text: '+ @router.post("/artifacts/{artifact_id}/revert", response=ArtifactSchema)', leftNum: null, rightNum: 56, wordHighlight: '/artifacts/{artifact_id}/revert' },
    { type: 'addition', text: '+ def revert_artifact(request, artifact_id: UUID, payload: ArtifactRevertSchema):', leftNum: null, rightNum: 57, wordHighlight: 'ArtifactRevertSchema' },
    { type: 'addition', text: '+     """Append historical snapshot as new forward version."""', leftNum: null, rightNum: 58, wordHighlight: 'Append historical snapshot' },

    // HUNK 4: Section 4 Subtype Governance Table
    { id: 'diff-chunk-4', type: 'header', text: '@@ -68,6 +86,7 @@ Hunk 4: Subtype Matrix & Governance Table' },
    { type: 'context', text: '| `Document` | Structured knowledge sheet article | `under_review` | Semantic Graph Check |', leftNum: 68, rightNum: 86 },
    { type: 'addition', text: '+ | `Context` | Execution context snapshot for AI agents | `draft` | Automated Schema Validation |', leftNum: null, rightNum: 87, wordHighlight: 'Execution context snapshot' },
    { type: 'context', text: '---', leftNum: 69, rightNum: 88 },
  ];

  const diagramV2Code = `sequenceDiagram
    actor Human
    actor Agent
    Human->>Agent: Send task
    Agent-->>Human: Done`;

  const diagramV3Code = `sequenceDiagram
    autonumber
    actor Human as Human Developer
    participant Agent as AI Coding Agent
    participant Gateway as Lore API Gateway
    Human->>Agent: Propose task
    Agent->>Gateway: POST /api/artifacts
    Gateway-->>Human: Draft Created`;

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
          onClick={() => toggleDiffState(!showDiff)}
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

      {/* REVERT NOTIFICATION BANNER */}
      {restoreNotification && (
        <div style={styles.restoreToast}>
          <Check size={14} style={{ color: '#4ade80', marginRight: '6px' }} />
          <span>{restoreNotification}</span>
        </div>
      )}

      {/* FULL CANVAS READING AREA */}
      <div style={styles.fullCanvasScrollArea}>
        <div style={styles.centerColumn}>
          <div style={styles.body}>
            
            {/* CANVAS HEADER WITH NO-BG SUBTYPE TEXT & DRAFT PILL */}
            <div style={styles.canvasHeader}>
              <h1 style={styles.mainTitle}>System Architecture & Lore Contracts</h1>

              {/* Single-Line Property Strip */}
              <div style={styles.quietPropertyStrip}>
                
                {/* SUBTYPE TEXT */}
                <span style={styles.noBgSubtypeText}>
                  Decision
                </span>

                <span style={styles.propDot}>•</span>
                
                {/* LIFECYCLE STATE PILL */}
                <span
                  style={{
                    ...styles.inlineStatePill,
                    ...(approvalStatus === 'approved'
                      ? styles.approvedPill
                      : approvalStatus === 'rejected'
                      ? styles.rejectedPill
                      : styles.draftPill),
                  }}
                >
                  {approvalStatus.toUpperCase()}
                </span>

                <span style={styles.propDot}>•</span>

                {/* PRINCIPALS */}
                <span style={styles.propVal}>Created by Architecture Agent</span>

                <span style={styles.propDot}>•</span>
                
                <span style={styles.propVal}>Steward: Wisdom</span>

                <span style={styles.propDot}>•</span>
                <code style={styles.propCode}>7087ed86</code>
              </div>
            </div>

            {showDiff ? (
              /* DIRECT-ON-CANVAS REVIEW FLOW (SEAMLESS UNWRAPPED CANVAS EXPERIENCE) */
              <div style={styles.canvasDiffFlowContainer}>
                
                {/* HEADER METADATA DIFF SECTION (UNIFIED TOOLBAR CARD) */}
                <div style={styles.diffMetadataBanner}>
                  <div style={styles.diffBannerTitleRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={styles.versionJumpBadge}>
                        <Clock size={13} style={{ color: '#71717a', marginRight: '6px' }} />
                        <span style={{ color: '#a1a1aa' }}>v2</span>
                        <span style={{ color: '#52525b', margin: '0 6px' }}>→</span>
                        <span style={{ color: '#e4e4e7', fontWeight: '600' }}>v3 (Current)</span>
                      </div>

                      {/* DYNAMIC STATE TRANSITION BADGE */}
                      <div style={styles.stateTransitionBadge}>
                        <span style={styles.stateFromLabel}>Draft</span>
                        <span style={styles.stateArrow}>→</span>
                        <span
                          style={{
                            ...styles.stateToLabel,
                            color: approvalStatus === 'approved' ? '#4ade80' : approvalStatus === 'rejected' ? '#f87171' : '#a1a1aa',
                          }}
                        >
                          {approvalStatus === 'approved' ? 'Approved' : approvalStatus === 'rejected' ? 'Rejected' : 'Draft Proposal'}
                        </span>
                      </div>

                      <div style={styles.diffStatsSummary}>
                        <span style={styles.addStatBadge}>+12</span>
                        <span style={styles.delStatBadge}>-3</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                      <button
                        onClick={() => handleRevertVersion('v2')}
                        style={styles.restoreBtn}
                        title="Revert snapshot to v2 (appends new forward draft snapshot v4)"
                      >
                        <RotateCcw size={12} style={{ marginRight: '5px' }} />
                        <span>Revert to v2</span>
                      </button>

                      <button onClick={() => toggleDiffState(false)} style={styles.backToDocBtn}>
                        <ArrowLeft size={14} style={{ marginRight: '5px' }} /> Exit Review
                      </button>
                    </div>
                  </div>

                  {/* LORE GRAPH DEPENDENCY CONTEXT & VIEW MODE SWITCHER */}
                  <div style={styles.diffBannerSubRow}>
                    <div style={styles.affectedArtifactsGroup}>
                      <Network size={12} style={{ color: '#71717a', marginRight: '4px' }} />
                      <span style={{ color: '#71717a', fontSize: '12px', marginRight: '4px' }}>
                        Derived & Affected (3):
                      </span>
                      <span
                        style={styles.affectedChip}
                        onClick={() => onSelectWikiLink?.('API Gateway')}
                      >
                        API Gateway ↗
                      </span>
                      <span
                        style={styles.affectedChip}
                        onClick={() => onSelectWikiLink?.('Security Policy')}
                      >
                        Security Policy ↗
                      </span>
                      <span
                        style={styles.affectedChip}
                        onClick={() => onSelectWikiLink?.('OAuth ADR')}
                      >
                        OAuth ADR ↗
                      </span>
                    </div>

                    {/* SPLIT VS UNIFIED MODE TOGGLE CONTROLS */}
                    <div style={styles.modeToggleGroup}>
                      <button
                        onClick={() => setDiffMode('unified')}
                        className={`ag-diff-toggle-btn ${diffMode === 'unified' ? 'active' : ''}`}
                      >
                        <AlignLeft size={12} style={{ marginRight: '4px' }} />
                        Unified
                      </button>
                      <button
                        onClick={() => setDiffMode('split')}
                        className={`ag-diff-toggle-btn ${diffMode === 'split' ? 'active' : ''}`}
                      >
                        <Columns size={12} style={{ marginRight: '4px' }} />
                        Split
                      </button>
                    </div>
                  </div>
                </div>

                {/* MERMAID DIAGRAM VISUAL COMPARISON (TRANSPARENT DIRECT-ON-CANVAS LOOK) */}
                <div style={styles.diagramDiffAccordion}>
                  <div
                    style={styles.diagramAccordionHeader}
                    onClick={() => setShowDiagramDiff(!showDiagramDiff)}
                  >
                    {showDiagramDiff ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <Eye size={13} style={{ color: '#38bdf8', marginLeft: '6px', marginRight: '6px' }} />
                    <span style={{ color: '#D4D4D4', fontWeight: '500', fontSize: '13px' }}>
                      Visual Diagram Comparison (Mermaid Flow v2 vs v3)
                    </span>
                  </div>

                  {showDiagramDiff && (
                    <div style={styles.diagramCompareGrid}>
                      <div style={styles.diagramComparePane}>
                        <span style={styles.diagramPaneLabel}>v2 Previous Diagram</span>
                        <MermaidRenderer chart={diagramV2Code} />
                      </div>
                      <div style={styles.diagramComparePane}>
                        <span style={styles.diagramPaneLabel}>v3 Current Diagram</span>
                        <MermaidRenderer chart={diagramV3Code} />
                      </div>
                    </div>
                  )}
                </div>

                {/* UNIFIED OR SPLIT LINE DIFF VIEW (DIRECT ON CANVAS SURFACING) */}
                {diffMode === 'unified' ? (
                  <div style={styles.unifiedDiffList}>
                    {bulkyDiffData.map((row, idx) => (
                      <div
                        key={idx}
                        id={row.id}
                        style={{
                          ...styles.unifiedDiffRow,
                          ...(row.type === 'addition'
                            ? styles.additionLine
                            : row.type === 'deletion'
                            ? styles.deletionLine
                            : row.type === 'header'
                            ? styles.headerLine
                            : styles.contextLine),
                        }}
                      >
                        <span style={styles.lineNumCol}>{row.leftNum || ''}</span>
                        <span style={styles.lineNumCol}>{row.rightNum || ''}</span>
                        <span style={styles.linePrefix}>{row.text.slice(0, 1)}</span>
                        <span style={styles.lineContentText}>
                          {row.wordHighlight ? (
                            <>
                              {row.text.slice(2).split(row.wordHighlight)[0]}
                              <span
                                style={{
                                  ...styles.wordHighlightSpan,
                                  ...(row.type === 'addition'
                                    ? styles.addWordSpan
                                    : styles.delWordSpan),
                                }}
                              >
                                {row.wordHighlight}
                              </span>
                              {row.text.slice(2).split(row.wordHighlight)[1] || ''}
                            </>
                          ) : (
                            row.text.slice(2)
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.splitDiffGrid}>
                    <div style={styles.splitPane}>
                      <div style={styles.splitPaneHeader}>Previous Version (v2)</div>
                      <div style={styles.splitPaneContent}>
                        {bulkyDiffData
                          .filter((r) => r.type !== 'addition')
                          .map((r, idx) => (
                            <div
                              key={idx}
                              id={r.id ? `${r.id}-left` : undefined}
                              style={{
                                ...styles.splitRow,
                                ...(r.type === 'deletion' ? styles.deletionLine : {}),
                              }}
                            >
                              <span style={styles.lineNumCol}>{r.leftNum || ''}</span>
                              <span>{r.text}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div style={styles.splitPane}>
                      <div style={styles.splitPaneHeader}>Current Version (v3)</div>
                      <div style={styles.splitPaneContent}>
                        {bulkyDiffData
                          .filter((r) => r.type !== 'deletion')
                          .map((r, idx) => (
                            <div
                              key={idx}
                              id={r.id ? `${r.id}-right` : undefined}
                              style={{
                                ...styles.splitRow,
                                ...(r.type === 'addition' ? styles.additionLine : {}),
                              }}
                            >
                              <span style={styles.lineNumCol}>{r.rightNum || ''}</span>
                              <span>{r.text}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

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
                  input: ({ type, checked }: any) => {
                    if (type === 'checkbox') {
                      return <TaskCheckbox checked={checked} />;
                    }
                    return <input type={type} checked={checked} readOnly />;
                  },
                  li: ({ className, children }: any) => {
                    const isTask = className?.includes('task-list-item');
                    return (
                      <li
                        style={{
                          ...styles.li,
                          ...(isTask ? { listStyleType: 'none', marginLeft: '-20px' } : {}),
                        }}
                      >
                        {React.Children.map(children, (child) =>
                          typeof child === 'string' ? parseRichInlineMarkdown(child) : child
                        )}
                      </li>
                    );
                  },
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

        {/* PROVENANCE & EVOLUTION HISTORY FOOTER */}
        <div style={styles.footerRow}>
          
          {/* LEFT ITEM: VERSION HISTORY */}
          <div style={styles.footerLeftItem} onClick={() => toggleDiffState(!showDiff)} title="Toggle version diff view">
            <Clock size={12} style={{ color: '#71717a', marginRight: '4px' }} />
            <span style={styles.footerLabel}>History:</span>
            <div style={styles.footerHistorySteps}>
              <span style={styles.historyStepLabel}>v1</span>
              <span style={styles.historyStepArrow}>→</span>
              <span style={styles.historyStepLabel}>v2</span>
              <span style={styles.historyStepArrow}>→</span>
              <span style={styles.historyStepCurrent}>v3</span>
            </div>
          </div>

          {/* CENTER ITEM: DERIVATION */}
          <div style={styles.footerCenterItem}>
            <span style={styles.footerLabel}>Derived from:</span>
            <span style={styles.footerValue}>[PRD Lore v2]</span>
          </div>

          {/* RIGHT ITEM: REFERENCES */}
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
    backgroundColor: '#202020',
    border: 'none',
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
    backgroundColor: 'transparent',
    color: '#4ade80',
    fontSize: '12px',
    fontWeight: '600',
  },
  delStatBadge: {
    backgroundColor: 'transparent',
    color: '#f87171',
    fontSize: '12px',
    fontWeight: '600',
  },
  bubblyActionBtn: {
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 8px',
    borderRadius: '16px',
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
    padding: '4px 12px',
  },
  hoveredApproveBtn: {
    backgroundColor: '#ffffff',
    color: '#000000',
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
    marginLeft: '5px',
  },
  tubeResetBtn: {
    backgroundColor: '#27272a',
    border: 'none',
    color: '#a1a1aa',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  restoreToast: {
    position: 'absolute',
    top: '72px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 30,
    backgroundColor: '#202020',
    border: 'none',
    borderRadius: '12px',
    padding: '8px 16px',
    color: '#D4D4D4',
    fontSize: '13px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
  },
  fullCanvasScrollArea: {
    width: '100%',
    height: '100vh',
    padding: '0px 48px 8px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: '#242424',
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
    height: '100%',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '4px',
    paddingTop: '44px',
    paddingBottom: '16px',
  },
  canvasHeader: {
    marginBottom: '36px',
  },
  mainTitle: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#D4D4D4',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
  },
  quietPropertyStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#71717a',
    flexWrap: 'wrap',
  },
  noBgSubtypeText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#a1a1aa',
  },
  inlineStatePill: {
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.6px',
    padding: '3px 10px',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  draftPill: {
    color: '#a1a1aa',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  approvedPill: {
    color: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
  },
  rejectedPill: {
    color: '#f87171',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
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
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: '11px',
  },
  heading1: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#D4D4D4',
    marginTop: '28px',
    marginBottom: '16px',
  },
  heading2: {
    fontSize: '19px',
    fontWeight: '600',
    color: '#D4D4D4',
    marginTop: '28px',
    marginBottom: '14px',
  },
  heading3: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#D4D4D4',
    marginTop: '22px',
    marginBottom: '12px',
  },
  paragraph: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#D4D4D4',
    marginBottom: '24px',
    textAlign: 'justify',
    hyphens: 'auto',
  },
  blockquote: {
    backgroundColor: 'transparent',
    padding: '12px 18px',
    borderRadius: '0 4px 4px 0',
    color: '#D4D4D4',
    fontSize: '14px',
    fontStyle: 'italic',
    marginBottom: '28px',
    border: 'none',
    borderLeft: '2px solid #D4D4D4',
  },
  markHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid #353535',
    margin: '32px 0',
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
    fontSize: '14px',
    lineHeight: '1.7',
    marginBottom: '8px',
    textAlign: 'justify',
    hyphens: 'auto',
  },
  inlineCode: {
    backgroundColor: '#202020',
    color: '#D4D4D4',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '13px',
  },
  codeContainer: {
    backgroundColor: 'transparent',
    border: 'none',
    paddingLeft: 0,
    marginTop: '16px',
    marginBottom: '24px',
  },
  codeHeader: {
    backgroundColor: 'transparent',
    padding: '4px 0 8px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  codeLangBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  langDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#71717a',
  },
  copyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#a1a1aa',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '3px 9px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
  },
  codeBlock: {
    padding: '6px 0 6px 0',
    fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Consolas, monospace",
    fontSize: '13px',
    lineHeight: '1.65',
    color: '#e4e4e7',
    overflowX: 'auto',
    margin: 0,
    backgroundColor: 'transparent',
  },
  tableWrapper: {
    backgroundColor: '#202020',
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
    backgroundColor: '#272727',
    color: '#D4D4D4',
    textAlign: 'left',
    padding: '10px 14px',
    fontWeight: '600',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  tr: {},
  td: {
    padding: '12px 14px',
    color: '#D4D4D4',
    fontSize: '13px',
  },
  canvasDiffFlowContainer: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    paddingTop: '8px',
  },
  diffMetadataBanner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '12px',
    padding: '14px 18px',
    marginBottom: '8px',
  },
  diffBannerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '14px',
    width: '100%',
  },
  versionJumpBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '13px',
  },
  stateTransitionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  stateFromLabel: {
    color: '#a1a1aa',
  },
  stateArrow: {
    color: '#52525b',
  },
  stateToLabel: {
    color: '#4ade80',
  },
  diffStatsSummary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },

  restoreBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#D4D4D4',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.15s ease',
  },
  backToDocBtn: {
    background: 'none',
    border: 'none',
    color: '#a1a1aa',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 8px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
  },
  diffBannerSubRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  affectedArtifactsGroup: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  affectedChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '6px',
    padding: '3px 9px',
    color: '#a1a1aa',
    fontSize: '12px',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  modeToggleGroup: {
    display: 'inline-flex',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '7px',
    padding: '2px',
    gap: '2px',
    marginLeft: 'auto',
  },
  toggleBtn: {
    background: 'none',
    border: '1px solid transparent',
    color: '#71717a',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.15s ease',
  },
  activeToggleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    fontWeight: '600',
  },
  diagramDiffAccordion: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    paddingBottom: '24px',
    borderBottom: '1px solid #353535',
  },
  diagramAccordionHeader: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  diagramCompareGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    paddingTop: '8px',
  },
  diagramComparePane: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  diagramPaneLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#7c7c80',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  unifiedDiffList: {
    backgroundColor: '#202020',
    borderRadius: '12px',
    overflow: 'hidden',
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace",
    fontSize: '13px',
    lineHeight: '1.65',
  },
  unifiedDiffRow: {
    padding: '6px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  lineNumCol: {
    userSelect: 'none',
    width: '24px',
    color: '#71717a',
    fontSize: '11px',
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 0,
  },
  linePrefix: {
    userSelect: 'none',
    fontWeight: '700',
    width: '12px',
    flexShrink: 0,
  },
  lineContentText: {
    flex: 1,
    whiteSpace: 'pre-wrap',
  },
  wordHighlightSpan: {
    padding: '1px 4px',
    borderRadius: '3px',
    fontWeight: '500',
  },
  addWordSpan: {
    backgroundColor: 'rgba(74, 222, 128, 0.25)',
    color: '#86efac',
  },
  delWordSpan: {
    backgroundColor: 'rgba(248, 113, 113, 0.25)',
    color: '#fca5a5',
  },
  additionLine: {
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    color: '#4ade80',
  },
  deletionLine: {
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    color: '#f87171',
  },
  contextLine: {
    color: '#a1a1aa',
  },
  headerLine: {
    backgroundColor: '#272727',
    color: '#7c7c80',
    fontStyle: 'italic',
    padding: '6px 14px',
  },
  splitDiffGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  splitPane: {
    backgroundColor: '#202020',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  splitPaneHeader: {
    backgroundColor: '#272727',
    padding: '8px 14px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#7c7c80',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  splitPaneContent: {
    padding: '12px',
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace",
    fontSize: '12px',
    lineHeight: '1.6',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  splitRow: {
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'flex',
    gap: '8px',
  },
  footerRow: {
    display: 'flex',
    alignItems: 'center',
    fontSize: tokens.typography.caption.fontSize,
    paddingTop: '6px',
    paddingBottom: '6px',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
  },
  footerLeftItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  footerHistorySteps: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  historyStepLabel: {
    color: '#71717a',
    fontSize: '11px',
  },
  historyStepArrow: {
    color: '#3f3f46',
    fontSize: '10px',
  },
  historyStepCurrent: {
    color: '#D4D4D4',
    fontWeight: '600',
    fontSize: '11px',
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
    color: '#D4D4D4',
    fontWeight: '500',
    fontSize: '12px',
  },
  countBadge: {
    backgroundColor: '#202020',
    color: '#a1a1aa',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '8px',
  },
};
