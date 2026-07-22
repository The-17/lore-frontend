import React from 'react';

interface LeftTubeNavProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenBYOBModal?: () => void;
}

export const LeftTubeNav: React.FC<LeftTubeNavProps> = () => {
  return (
    <div style={styles.container}>
      {/* Lore Brand Header */}
      <div style={styles.brand}>Lore</div>

      {/* Upper Empty Nav Tube Capsule */}
      <div style={styles.upperTube} />

      <div style={{ flex: 1 }} />

      {/* Lower Empty Nav Tube Capsule */}
      <div style={styles.lowerTube} />
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
    marginBottom: '56px',
  },
  upperTube: {
    backgroundColor: '#2b2b2b',
    borderRadius: '32px',
    width: '64px',
    height: '240px',
  },
  lowerTube: {
    backgroundColor: '#2b2b2b',
    borderRadius: '32px',
    width: '64px',
    height: '140px',
  },
};
