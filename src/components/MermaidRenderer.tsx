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
            actorBkg: '#1e1b4b',
            actorBorder: '#818cf8',
            actorTextColor: '#ffffff',
            actorLineColor: '#60a5fa',
            signalColor: '#60a5fa',
            signalTextColor: '#e4e4e7',
            labelBoxBkgColor: '#202028',
            labelBoxBorderColor: '#3b82f6',
            labelTextColor: '#ffffff',
            loopTextColor: '#3fb950',
            noteBkgColor: '#332211',
            noteBorderColor: '#f59e0b',
            noteTextColor: '#f59e0b',
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
      .catch((err) => {
        console.warn('Mermaid sequence diagram render error:', err);
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
        /* Zero-dependency High Quality Canvas Sequence Diagram Fallback */
        <div style={styles.svgWrapper}>
          <svg width="720" height="380" viewBox="0 0 720 380" style={styles.svg}>
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

            {/* Lifelines */}
            <line x1="100" y1="60" x2="100" y2="340" stroke="#333338" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="270" y1="60" x2="270" y2="340" stroke="#333338" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="450" y1="60" x2="450" y2="340" stroke="#333338" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="620" y1="60" x2="620" y2="340" stroke="#333338" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Participants */}
            <rect x="40" y="20" width="120" height="36" rx="6" fill="#1e1b4b" stroke="#818cf8" />
            <text x="100" y="43" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">Human Dev</text>

            <rect x="210" y="20" width="120" height="36" rx="6" fill="#2563eb" stroke="#3b82f6" />
            <text x="270" y="43" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">AI Agent</text>

            <rect x="390" y="20" width="120" height="36" rx="6" fill="#202028" stroke="#3b82f6" />
            <text x="450" y="43" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">Lore Gateway</text>

            <rect x="560" y="20" width="120" height="36" rx="6" fill="#10b981" stroke="#34d399" />
            <text x="620" y="43" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">PostgreSQL</text>

            {/* Messages */}
            <line x1="100" y1="90" x2="270" y2="90" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="185" y="83" fill="#e4e4e7" fontSize="11" textAnchor="middle">1. Propose task request</text>

            <line x1="270" y1="130" x2="450" y2="130" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="360" y="123" fill="#e4e4e7" fontSize="11" textAnchor="middle">2. POST /api/artifacts (Draft)</text>

            <line x1="450" y1="170" x2="620" y2="170" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="535" y="163" fill="#e4e4e7" fontSize="11" textAnchor="middle">3. INSERT into artifacts table</text>

            {/* Note box */}
            <rect x="210" y="200" width="240" height="34" rx="6" fill="#332211" stroke="#f59e0b" />
            <text x="330" y="222" fill="#f59e0b" fontSize="11" fontWeight="600" textAnchor="middle">Human Approval Required (Glass Pill)</text>

            <line x1="100" y1="265" x2="450" y2="265" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="275" y="258" fill="#3fb950" fontSize="11" fontWeight="600" textAnchor="middle">4. Click "Aprove changes"</text>

            <line x1="450" y1="305" x2="620" y2="305" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="535" y="298" fill="#3fb950" fontSize="11" fontWeight="600" textAnchor="middle">5. UPDATE status='approved'</text>
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
