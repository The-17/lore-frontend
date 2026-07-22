import React from 'react';
import { Folder, GitFork, Cpu, ShieldCheck, Key, Settings, User } from 'lucide-react';

interface LeftTubeNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBYOBModal: () => void;
}

export const LeftTubeNav: React.FC<LeftTubeNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenBYOBModal,
}) => {
  const mainNavItems = [
    { id: 'workspace', label: 'Collections & Artifacts', icon: Folder },
    { id: 'graph', label: 'Interactive Artifact Graph', icon: GitFork },
    { id: 'skills', label: 'Dynamic Skill Registry', icon: Cpu },
    { id: 'approvals', label: 'Human Review Queue', icon: ShieldCheck },
  ];

  return (
    <div style={styles.container}>
      {/* Brand Header */}
      <div style={styles.brand}>Lore</div>

      {/* Upper Floating Tube (Primary Views) */}
      <div style={styles.tube}>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.iconBtn,
                backgroundColor: isActive ? 'var(--bg-tube-hover)' : 'transparent',
                color: isActive ? 'var(--accent-emerald)' : 'var(--text-muted)',
              }}
              title={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Lower Floating Tube (Utilities & Config) */}
      <div style={styles.tube}>
        <button
          onClick={onOpenBYOBModal}
          style={styles.iconBtn}
          title="BYOB Backend Connection Settings"
        >
          <Key size={18} />
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={styles.iconBtn}
          title="Workspace Settings"
        >
          <Settings size={18} />
        </button>
        <button style={styles.iconBtn} title="User Profile">
          <User size={18} />
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '72px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    backgroundColor: 'var(--bg-app)',
    userSelect: 'none',
  },
  brand: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    marginBottom: '28px',
  },
  tube: {
    backgroundColor: 'var(--bg-tube)',
    borderRadius: '24px',
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    border: '1px solid var(--border-card)',
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '18px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
