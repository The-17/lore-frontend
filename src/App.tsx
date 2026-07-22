import { useEffect, useState } from 'react';
import { LeftTubeNav } from './components/LeftTubeNav';
import { CollectionTree } from './components/CollectionTree';
import { ArtifactCanvas } from './components/ArtifactCanvas';
import { GraphCanvas } from './components/GraphCanvas';
import { BYOBModal } from './components/BYOBModal';
import { api } from './api/client';
import type { Artifact, Collection, Relationship } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [isBYOBOpen, setIsBYOBOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  // Initial Load from Self-Hosted Backend
  useEffect(() => {
    async function loadWorkspaceData() {
      try {
        const [colsData, artsData] = await Promise.all([
          api.getCollections().catch(() => []),
          api.getArtifacts().catch(() => []),
        ]);
        setCollections(colsData);
        setArtifacts(artsData);
        if (artsData.length > 0) {
          setActiveArtifact(artsData[0]);
        }
      } catch (err) {
        console.warn('Backend connection failed:', err);
      }
    }
    loadWorkspaceData();
  }, []);

  // Fetch relationships when active artifact changes
  useEffect(() => {
    if (!activeArtifact) return;
    api
      .getRelationships(activeArtifact.id)
      .then(setRelationships)
      .catch(() => setRelationships([]));
  }, [activeArtifact]);

  const handleSelectArtifact = (id: string) => {
    const found = artifacts.find((a) => a.id === id);
    if (found) {
      setActiveArtifact(found);
    } else {
      api.getArtifact(id).then(setActiveArtifact).catch(console.error);
    }
  };

  const handleWikiLinkClick = (title: string) => {
    const found = artifacts.find((a) => a.title.toLowerCase() === title.toLowerCase());
    if (found) {
      setActiveArtifact(found);
    } else {
      api.getSkillByTitle(title).then(setActiveArtifact).catch(console.error);
    }
  };

  return (
    <div style={styles.appShell}>
      {/* Dual Left Tube Rail */}
      <LeftTubeNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBYOBModal={() => setIsBYOBOpen(true)}
      />

      {/* Main View Area */}
      {activeTab === 'workspace' && (
        <div style={styles.workspaceSplit}>
          <CollectionTree
            collections={collections}
            artifacts={artifacts}
            activeArtifactId={activeArtifact?.id}
            onSelectArtifact={handleSelectArtifact}
          />
          <ArtifactCanvas
            artifact={activeArtifact}
            onSelectWikiLink={handleWikiLinkClick}
          />
        </div>
      )}

      {activeTab === 'graph' && (
        <GraphCanvas
          artifacts={artifacts}
          relationships={relationships}
          onSelectArtifact={(id) => {
            handleSelectArtifact(id);
            setActiveTab('workspace');
          }}
        />
      )}

      {/* BYOB Configuration Modal */}
      <BYOBModal isOpen={isBYOBOpen} onClose={() => setIsBYOBOpen(false)} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appShell: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-app)',
    overflow: 'hidden',
  },
  workspaceSplit: {
    display: 'flex',
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
};

export default App;
