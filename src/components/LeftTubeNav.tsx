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
                backgroundColor: isActive ? '#38383e' : 'transparent',
                color: isActive ? '#10b981' : '#a1a1aa',
              }}
              title={item.label}
            >
              <Icon size={19} />
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
    width: '120px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 0',
    backgroundColor: '#1c1c1f',
    userSelect: 'none',
    flexShrink: 0,
  },
  brand: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    marginBottom: '32px',
  },
  tube: {
    backgroundColor: '#26262a',
    borderRadius: '28px',
    padding: '8px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
