import React from 'react';

export const LeftSidebarPane: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Clean Empty Left Pane (#222222) - Ready for user content */}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '280px',
    height: '100vh',
    backgroundColor: '#222222',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
    flexShrink: 0,
  },
};
