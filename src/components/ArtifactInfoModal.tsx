import React, { useState } from 'react';
import { X, GitFork, ShieldCheck, Activity, FileText, Layers, CheckCircle, User, Clock, ArrowUpRight } from 'lucide-react';
import { tokens } from '../design-system/tokens';

interface ArtifactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRelatedArtifact?: (title: string) => void;
}

export const ArtifactInfoModal: React.FC<ArtifactInfoModalProps> = ({
  isOpen,
  onClose,
  onSelectRelatedArtifact,
}) => {
  const [activeTab, setActiveTab] = useState<'lineage' | 'governance' | 'activity'>('lineage');

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header Bar */}
        <div style={styles.headerBar}>
          <div style={styles.headerTitleGroup}>
            <span style={styles.modalTitle}>Artifact Inspector</span>
            <span style={styles.uuidBadge}>UUID: 7087ed86-1490</span>
            <span style={styles.subtypeBadge}>Document</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose} title="Close Inspector (Esc)">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div style={styles.tabBar}>
          <button
            onClick={() => setActiveTab('lineage')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'lineage' ? styles.activeTabBtn : {}),
            }}
          >
            <GitFork size={14} style={{ marginRight: '6px' }} />
            Provenance & Lineage
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'governance' ? styles.activeTabBtn : {}),
            }}
          >
            <ShieldCheck size={14} style={{ marginRight: '6px' }} />
            Governance & Audit
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'activity' ? styles.activeTabBtn : {}),
            }}
          >
            <Activity size={14} style={{ marginRight: '6px' }} />
            Activity & Metrics
          </button>
        </div>

        {/* Tab 1: Provenance & Lineage */}
        {activeTab === 'lineage' && (
          <div style={styles.tabBody}>
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>Collection</span>
              <span style={styles.metaVal}>Projects / Lore Knowledge Vault</span>
            </div>

            <div style={styles.groupSection}>
              <span style={styles.groupTitle}>▲ Derived From (2)</span>
              <div style={styles.linkList}>
                <div
                  style={styles.linkItem}
                  onClick={() => onSelectRelatedArtifact?.('PRD Lore v2')}
                >
                  <FileText size={13} style={{ color: '#60a5fa', marginRight: '8px' }} />
                  <span>PRD Lore v2</span>
                  <ArrowUpRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </div>
                <div
                  style={styles.linkItem}
                  onClick={() => onSelectRelatedArtifact?.('Research Phase')}
                >
                  <FileText size={13} style={{ color: '#60a5fa', marginRight: '8px' }} />
                  <span>Research Phase</span>
                  <ArrowUpRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </div>
              </div>
            </div>

            <div style={styles.groupSection}>
              <span style={styles.groupTitle}>▼ Used In (3)</span>
              <div style={styles.linkList}>
                <div
                  style={styles.linkItem}
                  onClick={() => onSelectRelatedArtifact?.('Lore Core SDK')}
                >
                  <Layers size={13} style={{ color: '#3fb950', marginRight: '8px' }} />
                  <span>Lore Core SDK</span>
                  <ArrowUpRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </div>
                <div
                  style={styles.linkItem}
                  onClick={() => onSelectRelatedArtifact?.('Skill Registry')}
                >
                  <Layers size={13} style={{ color: '#3fb950', marginRight: '8px' }} />
                  <span>Skill Registry</span>
                  <ArrowUpRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </div>
                <div
                  style={styles.linkItem}
                  onClick={() => onSelectRelatedArtifact?.('MCP Spec')}
                >
                  <Layers size={13} style={{ color: '#3fb950', marginRight: '8px' }} />
                  <span>MCP Spec</span>
                  <ArrowUpRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Governance & Audit */}
        {activeTab === 'governance' && (
          <div style={styles.tabBody}>
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>Produced By</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} style={{ color: '#818cf8' }} />
                <span style={styles.metaVal}>Architecture Agent</span>
              </div>
            </div>

            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>Approved By</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={13} style={{ color: '#3fb950' }} />
                <span style={{ ...styles.metaVal, color: '#3fb950', fontWeight: '600' }}>Wisdom (Human Lead)</span>
              </div>
            </div>

            <div style={styles.groupSection}>
              <span style={styles.groupTitle}>Automated Policy Checks</span>
              <div style={styles.policyBox}>
                <div style={styles.policyRow}>
                  <CheckCircle size={14} style={{ color: '#3fb950', marginRight: '8px' }} />
                  <span style={{ fontSize: '13px', color: '#ffffff' }}>Zero-Trust Auth Policy</span>
                  <span style={styles.passedTag}>Passed</span>
                </div>
                <div style={styles.policyRow}>
                  <CheckCircle size={14} style={{ color: '#3fb950', marginRight: '8px' }} />
                  <span style={{ fontSize: '13px', color: '#ffffff' }}>JSON Ninja OpenAPI Schema</span>
                  <span style={styles.passedTag}>Passed</span>
                </div>
                <div style={styles.policyRow}>
                  <CheckCircle size={14} style={{ color: '#3fb950', marginRight: '8px' }} />
                  <span style={{ fontSize: '13px', color: '#ffffff' }}>Semantic Graph Integrity</span>
                  <span style={styles.passedTag}>Passed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Activity & Metrics */}
        {activeTab === 'activity' && (
          <div style={styles.tabBody}>
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <span style={styles.metricVal}>26</span>
                <span style={styles.metricLabel}>Total Relationships</span>
              </div>
              <div style={styles.metricCard}>
                <span style={styles.metricVal}>14</span>
                <span style={styles.metricLabel}>Incoming Links</span>
              </div>
              <div style={styles.metricCard}>
                <span style={styles.metricVal}>12</span>
                <span style={styles.metricLabel}>Outgoing References</span>
              </div>
              <div style={styles.metricCard}>
                <span style={styles.metricVal}>8</span>
                <span style={styles.metricLabel}>Referencing Artifacts</span>
              </div>
            </div>

            <div style={styles.groupSection}>
              <span style={styles.groupTitle}>Version History</span>
              <div style={styles.historyList}>
                <div style={styles.historyRow}>
                  <Clock size={13} style={{ color: tokens.colors.textSecondary, marginRight: '8px' }} />
                  <span style={{ fontWeight: '600', color: '#ffffff' }}>v3 (Current)</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#888888' }}>10 mins ago (+12 / -3)</span>
                </div>
                <div style={styles.historyRow}>
                  <Clock size={13} style={{ color: tokens.colors.textSecondary, marginRight: '8px' }} />
                  <span style={{ color: tokens.colors.textSecondary }}>v2</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#888888' }}>Yesterday</span>
                </div>
                <div style={styles.historyRow}>
                  <Clock size={13} style={{ color: tokens.colors.textSecondary, marginRight: '8px' }} />
                  <span style={{ color: tokens.colors.textSecondary }}>v1 (Initial Draft)</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#888888' }}>3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  modalCard: {
    backgroundColor: '#1c1c20',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    width: '620px',
    maxWidth: '90vw',
    padding: '24px',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
  },
  uuidBadge: {
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#888888',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  subtypeBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: tokens.colors.textSecondary,
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '6px',
  },
  tabBar: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '8px',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    color: tokens.colors.textSecondary,
    fontSize: '13px',
    fontWeight: '500',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease',
  },
  activeTabBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontWeight: '600',
  },
  tabBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    paddingTop: '4px',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  metaLabel: {
    color: '#888888',
    fontSize: '12px',
    fontWeight: '600',
  },
  metaVal: {
    color: '#ffffff',
    fontWeight: '500',
  },
  groupSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  groupTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  linkItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  policyBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  policyRow: {
    display: 'flex',
    alignItems: 'center',
  },
  passedTag: {
    marginLeft: 'auto',
    fontSize: '11px',
    fontWeight: '600',
    color: '#3fb950',
    backgroundColor: 'rgba(46, 160, 67, 0.15)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metricVal: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
  },
  metricLabel: {
    fontSize: '12px',
    color: '#888888',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  historyRow: {
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
  },
};
