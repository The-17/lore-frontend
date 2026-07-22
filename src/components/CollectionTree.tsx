import React, { useState } from 'react';
import type { Artifact, Collection } from '../types';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown, Plus } from 'lucide-react';

interface CollectionTreeProps {
  collections: Collection[];
  artifacts: Artifact[];
  activeArtifactId?: string;
  onSelectArtifact: (id: string) => void;
  onCreateArtifact?: () => void;
}

export const CollectionTree: React.FC<CollectionTreeProps> = ({
  collections,
  artifacts,
  activeArtifactId,
  onSelectArtifact,
  onCreateArtifact,
}) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>COLLECTIONS</span>
        {onCreateArtifact && (
          <button onClick={onCreateArtifact} style={styles.addBtn} title="New Artifact">
            <Plus size={14} />
          </button>
        )}
      </div>

      <div style={styles.tree}>
        {/* Collections */}
        {collections.map((col) => {
          const isOpen = openFolders[col.id];
          const childArtifacts = artifacts.filter((a) => a.collection_id === col.id);

          return (
            <div key={col.id} style={styles.folderGroup}>
              <div style={styles.folderHeader} onClick={() => toggleFolder(col.id)}>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {isOpen ? <FolderOpen size={16} color="var(--accent-emerald)" /> : <Folder size={16} color="var(--accent-emerald)" />}
                <span style={styles.folderName}>{col.name}</span>
              </div>

              {isOpen && (
                <div style={styles.children}>
                  {childArtifacts.map((art) => {
                    const isSelected = activeArtifactId === art.id;
                    return (
                      <div
                        key={art.id}
                        onClick={() => onSelectArtifact(art.id)}
                        style={{
                          ...styles.artifactItem,
                          backgroundColor: isSelected ? 'var(--bg-tube-hover)' : 'transparent',
                          color: isSelected ? '#ffffff' : 'var(--text-muted)',
                        }}
                      >
                        <FileText size={14} style={{ marginRight: '6px' }} />
                        <span style={styles.artifactTitle}>{art.title}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Root Level Artifacts */}
        {artifacts
          .filter((a) => !a.collection_id)
          .map((art) => {
            const isSelected = activeArtifactId === art.id;
            return (
              <div
                key={art.id}
                onClick={() => onSelectArtifact(art.id)}
                style={{
                  ...styles.artifactItem,
                  backgroundColor: isSelected ? 'var(--bg-tube-hover)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                }}
              >
                <FileText size={14} style={{ marginRight: '6px' }} />
                <span style={styles.artifactTitle}>{art.title}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '240px',
    height: '100%',
    backgroundColor: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-card)',
    padding: '20px 12px',
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '0 8px',
  },
  headerTitle: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    color: 'var(--text-dim)',
  },
  addBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  tree: {
    flex: 1,
    overflowY: 'auto',
  },
  folderGroup: {
    marginBottom: '4px',
  },
  folderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#e4e4e7',
    fontSize: '13px',
    fontWeight: '500',
  },
  folderName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  children: {
    paddingLeft: '20px',
    marginTop: '2px',
  },
  artifactItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    marginTop: '2px',
    transition: 'all 0.15s ease',
  },
  artifactTitle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
