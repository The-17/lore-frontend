import React from 'react';
import type { Artifact } from '../types';
import { ShieldCheck, Check, X, Clock, FileText, User } from 'lucide-react';

interface ApprovalsViewProps {
  pendingArtifacts: Artifact[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSelectArtifact: (id: string) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  pendingArtifacts,
  onApprove,
  onReject,
  onSelectArtifact,
}) => {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={22} color="var(--accent-purple)" />
          <h2 style={styles.title}>Human Approval Queue</h2>
        </div>
        <p style={styles.subtitle}>
          Review AI agent outputs in draft or under review. Humans retain final governance over artifact states.
        </p>
      </div>

      {/* Queue List */}
      {pendingArtifacts.length === 0 ? (
        <div style={styles.emptyState}>
          <ShieldCheck size={40} color="var(--text-dim)" />
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>No artifacts currently awaiting human review.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {pendingArtifacts.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FileText size={16} color="var(--accent-purple)" />
                  <h3
                    style={styles.itemTitle}
                    onClick={() => onSelectArtifact(item.id)}
                  >
                    {item.title}
                  </h3>
                  <span style={styles.stateBadge}>{item.lifecycle_state.replace('_', ' ')}</span>
                </div>

                <p style={styles.snippet}>
                  {item.rationale || item.content?.slice(0, 160) || 'New artifact submitted by agent.'}...
                </p>

                <div style={styles.metaRow}>
                  <span>
                    <User size={12} style={{ marginRight: '4px' }} />
                    Created by Strategy Agent
                  </span>
                  <span>
                    <Clock size={12} style={{ marginRight: '4px' }} />
                    {new Date(item.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.actions}>
                <button onClick={() => onApprove(item.id)} style={styles.approveBtn}>
                  <Check size={16} style={{ marginRight: '4px' }} /> Approve
                </button>
                <button onClick={() => onReject(item.id)} style={styles.rejectBtn}>
                  <X size={16} style={{ marginRight: '4px' }} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'var(--bg-app)',
    padding: '32px',
    overflowY: 'auto',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-card)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '840px',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '14px',
    border: '1px solid var(--border-card)',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    paddingRight: '24px',
  },
  itemTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
  },
  stateBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--accent-amber)',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    padding: '2px 8px',
    borderRadius: '6px',
    textTransform: 'capitalize',
  },
  snippet: {
    fontSize: '13px',
    color: '#a1a1aa',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: 'var(--text-dim)',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  approveBtn: {
    backgroundColor: 'var(--accent-purple)',
    border: 'none',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: 'transparent',
    border: '1px solid var(--border-card)',
    color: 'var(--text-muted)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
};
