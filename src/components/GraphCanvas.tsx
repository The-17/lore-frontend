import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import type { Artifact, Relationship } from '../types';

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

  useEffect(() => {
    if (!containerRef.current) return;

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
        label: a.title,
        shape: 'box',
        color: {
          background: '#242428',
          border: color,
          highlight: { background: '#2c2c30', border: color },
        },
        font: { color: '#ffffff', face: 'Inter', size: 14 },
        shadow: true,
      };
    });

    const edgesArray = relationships.map((r) => ({
      id: r.id,
      from: r.source_id,
      to: r.target_id,
      label: r.relation_type,
      arrows: 'to',
      color: { color: '#a1a1aa', highlight: '#10b981' },
      font: { color: '#71717a', size: 10, align: 'middle' },
    }));

    const nodesDataSet = new DataSet(nodesArray as any);
    const edgesDataSet = new DataSet(edgesArray as any);

    const data = {
      nodes: nodesDataSet,
      edges: edgesDataSet,
    };

    const options = {
      physics: {
        barnesHut: { gravitationalConstant: -2000, springLength: 120 },
      },
      interaction: { hover: true, zoomView: true },
    };

    const network = new Network(containerRef.current, data as any, options);

    network.on('click', (params) => {
      if (params.nodes && params.nodes.length > 0) {
        const clickedId = String(params.nodes[0]);
        onSelectArtifact(clickedId);
      }
    });

    return () => {
      network.destroy();
    };
  }, [artifacts, relationships, onSelectArtifact]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={{ color: '#ffffff', fontSize: '18px' }}>Interactive Artifact Lineage Graph</h3>
        <p style={styles.sub}>Click any node to focus artifact in workspace sheet.</p>
      </div>
      <div ref={containerRef} style={styles.networkCanvas} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-app)',
    padding: '24px',
  },
  header: {
    marginBottom: '16px',
  },
  sub: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  networkCanvas: {
    flex: 1,
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-card)',
  },
};
