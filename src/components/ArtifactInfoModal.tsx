import React, { useState } from 'react';
import { ArrowUpRight, X, CheckCircle, Clock } from 'lucide-react';

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
        
        {/* LEFT COLUMN: TITLE & VERTICAL NAVIGATION (BG: #242424) */}
        <div style={styles.leftPane}>
          <h2 style={styles.sidebarTitle}>Artifact Inspector</h2>

          <nav style={styles.verticalNav}>
            <button
              onClick={() => setActiveTab('lineage')}
              style={{
                ...styles.navItemBtn,
                ...(activeTab === 'lineage' ? styles.activeNavItemBtn : {}),
              }}
            >
              Provenance & Lineage
            </button>

            <button
              onClick={() => setActiveTab('governance')}
              style={{
                ...styles.navItemBtn,
                ...(activeTab === 'governance' ? styles.activeNavItemBtn : {}),
              }}
            >
              Governance & Audit
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              style={{
                ...styles.navItemBtn,
                ...(activeTab === 'activity' ? styles.activeNavItemBtn : {}),
              }}
            >
              Activity & Metrics
            </button>
          </nav>
        </div>

        {/* RIGHT COLUMN: CONTENT PANE (BG: #272727) */}
        <div style={styles.rightPane}>
          {/* Close button in top right */}
          <button style={styles.closeBtn} onClick={onClose} title="Close (Esc)">
            <X size={16} />
          </button>

          {/* TAB 1: PROVENANCE & LINEAGE */}
          {activeTab === 'lineage' && (
            <div style={styles.contentGroupStack}>
              
              {/* Collection Section */}
              <div style={styles.collectionSection}>
                <span style={styles.sectionLabel}>Collection</span>
                <div style={styles.collectionValue}>Projects/Lore Knowledge vault</div>
              </div>

              {/* Derived from (2) Section */}
              <div style={styles.sectionBlock}>
                <span style={styles.sectionLabel}>Derived from (2)</span>
                <div style={styles.chipsRow}>
                  <button
                    style={styles.linkChipBtn}
                    onClick={() => onSelectRelatedArtifact?.('PRD Lore v2')}
                  >
                    <span>PRD Lore v2</span>
                    <ArrowUpRight size={13} style={styles.chipArrow} />
                  </button>

                  <button
                    style={styles.linkChipBtn}
                    onClick={() => onSelectRelatedArtifact?.('Research Phase')}
                  >
                    <span>Research Phase</span>
                    <ArrowUpRight size={13} style={styles.chipArrow} />
                  </button>
                </div>
              </div>

              {/* Used In (3) Section */}
              <div style={styles.sectionBlock}>
                <span style={styles.sectionLabel}>Used In (3)</span>
                <div style={styles.chipsRow}>
                  <button
                    style={styles.linkChipBtn}
                    onClick={() => onSelectRelatedArtifact?.('PRD Lore Core SDK')}
                  >
                    <span>PRD Lore Core SDK</span>
                    <ArrowUpRight size={13} style={styles.chipArrow} />
                  </button>

                  <button
                    style={styles.linkChipBtn}
                    onClick={() => onSelectRelatedArtifact?.('Skill Registry')}
                  >
                    <span>Skill Registry</span>
                    <ArrowUpRight size={13} style={styles.chipArrow} />
                  </button>

                  <button
                    style={styles.linkChipBtn}
                    onClick={() => onSelectRelatedArtifact?.('MCP Spec')}
                  >
                    <span>MCP Spec</span>
                    <ArrowUpRight size={13} style={styles.chipArrow} />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GOVERNANCE & AUDIT */}
          {activeTab === 'governance' && (
            <div style={styles.contentGroupStack}>
              <div style={styles.sectionBlock}>
                <span style={styles.sectionLabel}>Created by</span>
                <div style={styles.infoTextValue}>Architecture Agent (AI Coding Agent)</div>
              </div>

              <div style={styles.sectionBlock}>
                <span style={styles.sectionLabel}>Steward</span>
                <div style={styles.infoTextValue}>Wisdom (Human Principal)</div>
              </div>

              <div style={styles.sectionBlock}>
                <span style={styles.sectionLabel}>Policy Checks</span>
                <div style={styles.policyStack}>
                  <div style={styles.policyItem}>
                    <CheckCircle size={13} style={{ color: '#4ade80', marginRight: '6px' }} />
                    <span>Zero-Trust Token Auth</span>
                  </div>
                  <div style={styles.policyItem}>
                    <CheckCircle size={13} style={{ color: '#4ade80', marginRight: '6px' }} />
                    <span>Django Ninja OpenAPI Schema</span>
                  </div>
                  <div style={styles.policyItem}>
                    <CheckCircle size={13} style={{ color: '#4ade80', marginRight: '6px' }} />
                    <span>Semantic Lineage Integrity</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVITY & METRICS (RESTORED METRICS GRID + DETAILED VERSION TIMELINE) */}
          {activeTab === 'activity' && (
            <div style={styles.contentGroupStack}>
              
              {/* Metrics Card Grid */}
              <div style={styles.sectionBlock}>
                <span style={styles.sectionLabel}>System Metrics</span>
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
              </div>

              {/* Version Evolution History List */}
              <div style={styles.sectionBlock}>
                <span style={styles.sectionLabel}>Evolution History</span>
                <div style={styles.historyStack}>
                  <div style={styles.historyRowItem}>
                    <Clock size={12} style={{ color: '#71717a', marginRight: '6px' }} />
                    <span style={{ color: '#D4D4D4', fontWeight: '500' }}>v3 (Current)</span>
                    <span style={{ marginLeft: 'auto', color: '#71717a', fontSize: '12px' }}>10 mins ago (+12 / -3)</span>
                  </div>
                  <div style={styles.historyRowItem}>
                    <Clock size={12} style={{ color: '#71717a', marginRight: '6px' }} />
                    <span style={{ color: '#a1a1aa' }}>v2</span>
                    <span style={{ marginLeft: 'auto', color: '#71717a', fontSize: '12px' }}>Yesterday</span>
                  </div>
                  <div style={styles.historyRowItem}>
                    <Clock size={12} style={{ color: '#71717a', marginRight: '6px' }} />
                    <span style={{ color: '#a1a1aa' }}>v1 (Initial Draft)</span>
                    <span style={{ marginLeft: 'auto', color: '#71717a', fontSize: '12px' }}>3 days ago</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  modalCard: {
    display: 'flex',
    width: '740px',
    maxWidth: '92vw',
    minHeight: '400px',
    backgroundColor: '#242424',
    border: '1px solid #333333',
    borderRadius: '16px',
    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7)',
    overflow: 'hidden',
  },
  leftPane: {
    width: '240px',
    backgroundColor: '#242424',
    padding: '36px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
    borderRight: '1px solid #303030',
    flexShrink: 0,
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#D4D4D4',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  verticalNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  navItemBtn: {
    background: 'none',
    border: 'none',
    color: '#8e8e93',
    fontSize: '14px',
    fontWeight: '400',
    textAlign: 'left',
    padding: 0,
    cursor: 'pointer',
    transition: 'color 0.15s ease',
  },
  activeNavItemBtn: {
    color: '#D4D4D4',
    fontWeight: '500',
  },
  rightPane: {
    flex: 1,
    backgroundColor: '#272727',
    padding: '36px 36px 36px 36px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: '#71717a',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentGroupStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  collectionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    paddingBottom: '20px',
    borderBottom: '1px solid #353535',
  },
  sectionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionLabel: {
    fontSize: '12px',
    color: '#7c7c80',
    fontWeight: '400',
  },
  collectionValue: {
    fontSize: '14px',
    color: '#D4D4D4',
    fontWeight: '400',
  },
  chipsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  linkChipBtn: {
    background: 'none',
    border: 'none',
    color: '#D4D4D4',
    fontSize: '13px',
    fontWeight: '400',
    padding: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
  },
  chipArrow: {
    color: '#a1a1aa',
    fontSize: '12px',
  },
  infoTextValue: {
    fontSize: '14px',
    color: '#D4D4D4',
  },
  policyStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  policyItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#D4D4D4',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  metricCard: {
    backgroundColor: '#202020',
    border: '1px solid #303030',
    borderRadius: '8px',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  metricVal: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#D4D4D4',
  },
  metricLabel: {
    fontSize: '11px',
    color: '#7c7c80',
  },
  historyStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  historyRowItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
  },
};
