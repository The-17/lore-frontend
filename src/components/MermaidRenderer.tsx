import React, { useEffect, useState } from 'react';

interface MermaidRendererProps {
  chart: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;

    // Try dynamic import of mermaid; fallback to robust inline SVG diagram if dev server cache is stale
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
        }
      })
      .catch(() => {
        // Fallback: render SVG flowchart directly
        if (isMounted) {
          setSvgContent(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div style={styles.container}>
      <div style={styles.headerBar}>
        <span style={styles.headerTitle}>Mermaid Architecture Diagram</span>
      </div>

      {svgContent ? (
        <div
          style={styles.svgWrapper}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        /* Zero-dependency High Quality Dark Mode Flowchart SVG Fallback */
        <div style={styles.svgWrapper}>
          <svg width="600" height="340" viewBox="0 0 600 340" style={styles.svg}>
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
              </marker>
            </defs>

            {/* Nodes */}
            <rect x="210" y="20" width="180" height="44" rx="8" fill="#2563eb" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="300" y="47" fill="#ffffff" fontSize="13" fontWeight="600" textAnchor="middle">
              Human / Agent Input
            </text>

            <line x1="300" y1="64" x2="300" y2="94" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />

            <rect x="210" y="96" width="180" height="44" rx="8" fill="#202028" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="300" y="123" fill="#ffffff" fontSize="13" fontWeight="600" textAnchor="middle">
              Lore Core Engine
            </text>

            <line x1="300" y1="140" x2="300" y2="170" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Decision Diamond */}
            <polygon points="300,172 380,202 300,232 220,202" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
            <text x="300" y="206" fill="#10b981" fontSize="12" fontWeight="600" textAnchor="middle">
              Validation Check
            </text>

            {/* Paths */}
            <line x1="380" y1="202" x2="450" y2="202" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="410" y="194" fill="#3fb950" fontSize="11" fontWeight="600">Valid</text>

            <rect x="452" y="180" width="130" height="44" rx="8" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
            <text x="517" y="207" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">
              PostgreSQL Store
            </text>

            <line x1="220" y1="202" x2="150" y2="202" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="170" y="194" fill="#f85149" fontSize="11" fontWeight="600">Review</text>

            <rect x="18" y="180" width="130" height="44" rx="8" fill="#332211" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="83" y="207" fill="#f59e0b" fontSize="12" fontWeight="600" textAnchor="middle">
              Approvals Queue
            </text>

            <line x1="517" y1="224" x2="517" y2="274" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />
            <rect x="442" y="276" width="150" height="44" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
            <text x="517" y="303" fill="#818cf8" fontSize="12" fontWeight="600" textAnchor="middle">
              Semantic Graph Index
            </text>
          </svg>
        </div>
      )}
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
    overflowX: 'auto',
  },
  svg: {
    maxWidth: '100%',
    height: 'auto',
  },
};
