import React, { useEffect, useState } from 'react';

interface MermaidRendererProps {
  chart: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;

    import('mermaid')
      .then((m) => {
        const mermaidInstance = m.default || m;
        mermaidInstance.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: 'transparent',
            primaryColor: '#2563eb',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#3b82f6',
            lineColor: '#60a5fa',
            secondaryColor: '#10b981',
            tertiaryColor: '#292929',
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
      {svgContent ? (
        <div
          style={styles.svgWrapper}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        /* Rich Complex Zero-dependency Multi-Subgraph Flowchart SVG */
        <div style={styles.svgWrapper}>
          <svg width="720" height="420" viewBox="0 0 720 420" style={styles.svg}>
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

            {/* Subgraph 1: Clients */}
            <rect x="20" y="20" width="680" height="70" rx="10" fill="rgba(37, 99, 235, 0.05)" stroke="rgba(37, 99, 235, 0.2)" strokeDasharray="4 4" />
            <text x="35" y="42" fill="#60a5fa" fontSize="11" fontWeight="700" textAnchor="start">1. CLIENT & AI AGENT LAYER</text>
            
            <rect x="50" y="46" width="160" height="34" rx="6" fill="#2563eb" stroke="#3b82f6" />
            <text x="130" y="68" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">Human Developer</text>
            
            <rect x="280" y="46" width="160" height="34" rx="6" fill="#1e1b4b" stroke="#818cf8" />
            <text x="360" y="68" fill="#818cf8" fontSize="12" fontWeight="600" textAnchor="middle">Autonomous AI Agent</text>

            <rect x="510" y="46" width="160" height="34" rx="6" fill="#202028" stroke="#3b82f6" />
            <text x="590" y="68" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">Lore API Gateway</text>

            <line x1="210" y1="63" x2="280" y2="63" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <line x1="440" y1="63" x2="510" y2="63" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* Subgraph 2: Core Engine */}
            <rect x="20" y="110" width="680" height="130" rx="10" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(16, 185, 129, 0.2)" strokeDasharray="4 4" />
            <text x="35" y="132" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="start">2. LORE CORE ENGINE & GOVERNANCE</text>

            <line x1="590" y1="80" x2="590" y2="146" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="500" y="148" width="180" height="34" rx="6" fill="#202028" stroke="#3b82f6" />
            <text x="590" y="170" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">Router & Auth Middleware</text>

            <line x1="500" y1="165" x2="430" y2="165" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />

            <polygon points="360,140 430,165 360,190 290,165" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
            <text x="360" y="169" fill="#10b981" fontSize="11" fontWeight="600" textAnchor="middle">Policy Check</text>

            <line x1="290" y1="165" x2="220" y2="165" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="250" y="157" fill="#3fb950" fontSize="10" fontWeight="600">Auto-Pass</text>

            <rect x="40" y="148" width="180" height="34" rx="6" fill="#10b981" stroke="#34d399" />
            <text x="130" y="170" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">Memory Lineage Engine</text>

            <line x1="360" y1="190" x2="360" y2="210" stroke="#f85149" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="375" y="204" fill="#f85149" fontSize="10" fontWeight="600">Review</text>

            <rect x="270" y="210" width="180" height="24" rx="4" fill="#332211" stroke="#f59e0b" />
            <text x="360" y="226" fill="#f59e0b" fontSize="11" fontWeight="600" textAnchor="middle">Human Review Queue</text>

            {/* Subgraph 3: Storage Layer */}
            <rect x="20" y="260" width="680" height="130" rx="10" fill="rgba(99, 102, 241, 0.05)" stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="4 4" />
            <text x="35" y="282" fill="#818cf8" fontSize="11" fontWeight="700" textAnchor="start">3. PERSISTENT STORAGE & INDEXING</text>

            <line x1="130" y1="182" x2="130" y2="300" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="50" y="302" width="160" height="66" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
            <text x="130" y="332" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">PostgreSQL Store</text>
            <text x="130" y="350" fill="#a1a1aa" fontSize="10" textAnchor="middle">ORM & Schema Tables</text>

            <line x1="210" y1="335" x2="280" y2="335" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="280" y="302" width="160" height="66" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
            <text x="360" y="332" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">Chroma Vector Store</text>
            <text x="360" y="350" fill="#a1a1aa" fontSize="10" textAnchor="middle">Semantic Embeddings</text>

            <line x1="440" y1="335" x2="510" y2="335" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="510" y="302" width="160" height="66" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
            <text x="590" y="332" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">Graph Lineage Store</text>
            <text x="590" y="350" fill="#a1a1aa" fontSize="10" textAnchor="middle">[[Wiki-Link]] Edges</text>
          </svg>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '16px 0',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowX: 'auto',
  },
  svgWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflowX: 'auto',
  },
  svg: {
    maxWidth: '100%',
    height: 'auto',
  },
};
