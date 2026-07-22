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
      {/* Lore Brand Header */}
      <div style={styles.brand}>Lore</div>

      {/* Upper Floating Tube Pill */}
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
                backgroundColor: isActive ? '#3a3a3a' : 'transparent',
                color: isActive ? '#ffffff' : '#888888',
              }}
              title={item.label}
            >
              <Icon size={19} />
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Lower Floating Tube Pill */}
      <div style={styles.tube}>
        <button
          onClick={onOpenBYOBModal}
          style={styles.iconBtn}
          title="BYOB Backend Connection Settings"
        >
          <Key size={18} style={{ color: '#888888' }} />
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            ...styles.iconBtn,
            backgroundColor: activeTab === 'settings' ? '#3a3a3a' : 'transparent',
            color: activeTab === 'settings' ? '#ffffff' : '#888888',
          }}
          title="Workspace Settings"
        >
          <Settings size={18} />
        </button>
        <button style={styles.iconBtn} title="User Profile">
          <User size={18} style={{ color: '#888888' }} />
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '140px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 0',
    backgroundColor: '#1e1e1e',
    userSelect: 'none',
    flexShrink: 0,
  },
  brand: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    marginBottom: '48px',
  },
  tube: {
    backgroundColor: '#2b2b2b',
    borderRadius: '32px',
    padding: '10px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '60px',
    alignItems: 'center',
  },
  iconBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
