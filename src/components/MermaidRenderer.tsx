import React, { useEffect, useRef, useState } from 'react';

interface MermaidRendererProps {
  chart: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;

    // Dynamic import for seamless Vite HMR dev server resolution
    import('mermaid')
      .then((m) => {
        const mermaidInstance = m.default || m;
        mermaidInstance.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: '#18181c',
            primaryColor: '#2563eb',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#3b82f6',
            lineColor: '#60a5fa',
            secondaryColor: '#10b981',
            tertiaryColor: '#202024',
          },
          fontFamily: 'Inter, system-ui, sans-serif',
        });
        return mermaidInstance.render(uniqueId, chart);
      })
      .then(({ svg }) => {
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Mermaid dynamic import warning:', err);
          setError('Failed to render diagram syntax');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div style={styles.errorBox}>
        <span style={{ color: '#f85149', fontWeight: 600 }}>Diagram Syntax Error</span>
        <pre style={styles.errorPre}>{chart}</pre>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerBar}>
        <span style={styles.headerTitle}>Mermaid Architecture Diagram</span>
      </div>
      <div
        ref={containerRef}
        style={styles.svgWrapper}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#18181c',
    border: '1px solid #333338',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowX: 'auto',
  },
  headerBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  svgWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 0',
  },
  errorBox: {
    backgroundColor: 'rgba(248, 81, 73, 0.1)',
    border: '1px solid #f85149',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  errorPre: {
    fontSize: '12px',
    color: '#a1a1aa',
    marginTop: '8px',
  },
};
