import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import type { Artifact, Relationship } from '../types';
import { ExternalLink, Tag, Clock } from 'lucide-react';

interface GraphCanvasProps {
  artifacts: Artifact[];
  relationships: Relationship[];
  onSelectArtifact: (artifactId: string) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  artifacts,
  relationships,
  onSelectArtifact,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  useEffect(() => {
    if (!containerRef.current || artifacts.length === 0) return;

    // 1. Generate Nodes for ALL artifacts
    const nodesArray = artifacts.map((a) => {
      const colors: Record<string, string> = {
        skill: '#10b981',
        decision: '#a855f7',
        document: '#3b82f6',
        memory: '#f59e0b',
      };
      const color = colors[a.type] || '#71717a';

      return {
        id: a.id,
        label: `${a.title}\n[${a.type.toUpperCase()}]`,
        shape: 'box',
        color: {
          background: '#242428',
          border: color,
          highlight: { background: '#2c2c30', border: color },
        },
        font: { color: '#ffffff', face: 'Inter', size: 14, bold: true },
        margin: 14,
        shadow: true,
      };
    });

    // 2. Synthesize Graph Edges (from explicit relationships + parsed [[Wiki-Links]])
    const edgesMap = new Map<string, any>();

    // Add explicit relationships
    relationships.forEach((r) => {
      const edgeId = `${r.source_id}->${r.target_id}`;
      edgesMap.set(edgeId, {
        id: edgeId,
        from: r.source_id,
        to: r.target_id,
        label: r.relation_type,
        arrows: 'to',
        color: { color: '#a855f7', highlight: '#10b981' },
        font: { color: '#a1a1aa', size: 11, align: 'middle' },
      });
    });

    // Automatically extract [[Wiki-Link]] edges across all artifacts
    artifacts.forEach((source) => {
      const text = source.content || source.decision_text || source.skill_md_content || '';
      const matches = text.match(/\[\[(.*?)\]\]/g) || [];

      matches.forEach((m) => {
        const targetTitle = m.slice(2, -2).toLowerCase();
        const target = artifacts.find((t) => t.title.toLowerCase() === targetTitle);
        if (target && target.id !== source.id) {
          const edgeId = `${source.id}->${target.id}`;
          if (!edgesMap.has(edgeId)) {
            edgesMap.set(edgeId, {
              id: edgeId,
              from: source.id,
              to: target.id,
              label: 'references',
              arrows: 'to',
              color: { color: '#10b981', highlight: '#10b981' },
              font: { color: '#a1a1aa', size: 11, align: 'middle' },
              dashes: true,
            });
          }
        }
      });
    });

    const data = {
      nodes: new DataSet(nodesArray as any),
      edges: new DataSet(Array.from(edgesMap.values()) as any),
    };

    const options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -100,
          centralGravity: 0.02,
          springLength: 140,
          springConstant: 0.08,
        },
      },
      interaction: { hover: true, zoomView: true, dragView: true },
    };

    const network = new Network(containerRef.current, data as any, options);

    // Zoom and center after physics stabilizes
    setTimeout(() => {
      network.fit();
    }, 200);

    network.on('click', (params) => {
      if (params.nodes && params.nodes.length > 0) {
        const clickedId = String(params.nodes[0]);
        const found = artifacts.find((a) => a.id === clickedId) || null;
        setSelectedArtifact(found);
      } else {
        setSelectedArtifact(null);
      }
    });

    return () => {
      network.destroy();
    };
  }, [artifacts, relationships]);

  return (
    <div style={styles.wrapper}>
      {/* Graph Legend & Header */}
      <div style={styles.header}>
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>
            Interactive Artifact Graph & Lineage
          </h3>
          <p style={styles.sub}>
            Full 2D visualization of typed relationships and auto-extracted [[Wiki-Link]] dependencies.
          </p>
        </div>

        {/* Color Legend Badges */}
        <div style={styles.legend}>
          <span style={getLegendBadgeStyle('#10b981')}>Skill</span>
          <span style={getLegendBadgeStyle('#a855f7')}>Decision</span>
          <span style={getLegendBadgeStyle('#3b82f6')}>Document</span>
          <span style={getLegendBadgeStyle('#f59e0b')}>Memory</span>
        </div>
      </div>

      {/* Main Canvas & Slide-over Node Inspector */}
      <div style={styles.canvasContainer}>
        <div ref={containerRef} style={styles.networkCanvas} />

        {/* Selected Node Drawer */}
        {selectedArtifact && (
          <div style={styles.inspectorDrawer}>
            <div style={styles.drawerHeader}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                SELECTED NODE
              </span>
              <button
                onClick={() => onSelectArtifact(selectedArtifact.id)}
                style={styles.openSheetBtn}
              >
                Open in Sheet <ExternalLink size={12} style={{ marginLeft: '4px' }} />
              </button>
            </div>

            <h4 style={styles.nodeTitle}>{selectedArtifact.title}</h4>
            <p style={styles.nodeType}>
              <Tag size={12} style={{ marginRight: '4px' }} />
              Type: {selectedArtifact.type.toUpperCase()} | State: {selectedArtifact.lifecycle_state}
            </p>

            <p style={styles.nodeContent}>
              {selectedArtifact.rationale || selectedArtifact.content?.slice(0, 200) || selectedArtifact.skill_md_content?.slice(0, 200)}...
            </p>

            <div style={styles.nodeFooter}>
              <Clock size={12} style={{ marginRight: '4px' }} />
              Updated {new Date(selectedArtifact.updated_at).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getLegendBadgeStyle = (color: string): React.CSSProperties => ({
  fontSize: '12px',
  fontWeight: '600',
  color,
  backgroundColor: `${color}18`,
  border: `1px solid ${color}40`,
  padding: '4px 10px',
  borderRadius: '12px',
});

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    flex: 1,
    height: '100%',
    minHeight: '0',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-app)',
    padding: '28px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sub: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  legend: {
    display: 'flex',
    gap: '10px',
  },
  canvasContainer: {
    flex: 1,
    minHeight: '500px',
    position: 'relative',
    display: 'flex',
  },
  networkCanvas: {
    width: '100%',
    height: '100%',
    minHeight: '500px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-card)',
  },
  inspectorDrawer: {
    position: 'absolute',
    right: '20px',
    top: '20px',
    bottom: '20px',
    width: '320px',
    backgroundColor: 'rgba(32, 32, 36, 0.95)',
    backdropFilter: 'blur(12px)',
    borderRadius: '14px',
    border: '1px solid var(--border-card)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  openSheetBtn: {
    background: 'var(--bg-tube)',
    border: '1px solid var(--border-card)',
    color: '#ffffff',
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  nodeTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '6px',
  },
  nodeType: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  nodeContent: {
    fontSize: '13px',
    color: '#e4e4e7',
    lineHeight: '1.5',
    flex: 1,
  },
  nodeFooter: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    display: 'flex',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-card)',
  },
};
