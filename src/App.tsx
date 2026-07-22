import { useEffect, useState } from 'react';
import { LeftTubeNav } from './components/LeftTubeNav';
import { CollectionTree } from './components/CollectionTree';
import { ArtifactCanvas } from './components/ArtifactCanvas';
import { GraphCanvas } from './components/GraphCanvas';
import { BYOBModal } from './components/BYOBModal';
import { api } from './api/client';
import type { Artifact, Collection, Relationship, ArtifactVersion } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [isBYOBOpen, setIsBYOBOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [versions, setVersions] = useState<ArtifactVersion[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  // Initial Load from Self-Hosted Backend or Mock Fallback
  useEffect(() => {
    async function loadWorkspaceData() {
      try {
        const [colsData, artsData] = await Promise.all([
          api.getCollections(),
          api.getArtifacts(),
        ]);
        setCollections(colsData);
        setArtifacts(artsData);
        if (artsData.length > 0) {
          setActiveArtifact(artsData[0]);
        }
      } catch (err) {
        console.warn('Backend offline, rendered mock data:', err);
      }
    }
    loadWorkspaceData();
  }, []);

  // Fetch relationships and versions when active artifact changes
  useEffect(() => {
    if (!activeArtifact) return;
    Promise.all([
      api.getRelationships(activeArtifact.id).catch(() => []),
      api.getArtifactVersions(activeArtifact.id).catch(() => []),
    ]).then(([rels, vers]) => {
      setRelationships(rels);
      setVersions(vers);
    });
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
            versions={versions}
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
