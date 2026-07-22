import { useEffect, useState } from 'react';
import { LeftTubeNav } from './components/LeftTubeNav';
import { LeftSidebarPane } from './components/LeftSidebarPane';
import { ArtifactCanvas } from './components/ArtifactCanvas';
import { GraphCanvas } from './components/GraphCanvas';
import { SkillRegistryView } from './components/SkillRegistryView';
import { ApprovalsView } from './components/ApprovalsView';
import { SettingsView } from './components/SettingsView';
import { BYOBModal } from './components/BYOBModal';
import { api } from './api/client';
import { tokens } from './design-system/tokens';
import type { Artifact, Relationship, ArtifactVersion } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [isBYOBOpen, setIsBYOBOpen] = useState(false);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [versions, setVersions] = useState<ArtifactVersion[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState<number>(tokens.layout.defaultSidebarWidth);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('some-header-text');

  // Initial Load from Self-Hosted Backend or Mock Fallback
  useEffect(() => {
    async function loadWorkspaceData() {
      try {
        const [, artsData] = await Promise.all([
          api.getCollections(),
          api.getArtifacts(),
        ]);
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
    setActiveTab('workspace');
  };

  const handleApproveArtifact = (id: string) => {
    setArtifacts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lifecycle_state: 'approved' } : a))
    );
  };

  const handleRejectArtifact = (id: string) => {
    setArtifacts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lifecycle_state: 'rejected' } : a))
    );
  };

  const handleSelectHeading = (headingId: string) => {
    setActiveHeadingId(headingId);
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pendingArtifacts = artifacts.filter(
    (a) => a.lifecycle_state === 'draft' || a.lifecycle_state === 'under_review'
  );

  const skills = artifacts.filter((a) => a.type === 'skill');

  return (
    <div style={styles.appShell}>
      {/* Dual Left Tube Rail */}
      <LeftTubeNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBYOBModal={() => setIsBYOBOpen(true)}
      />

      {/* Main View Area: Two Column Resizable Grid */}
      {activeTab === 'workspace' && (
        <div style={styles.workspaceSplit}>
          {/* Left Sidebar Pane with TOC and Resizable Handle */}
          <LeftSidebarPane
            width={sidebarWidth}
            onWidthChange={setSidebarWidth}
            activeHeadingId={activeHeadingId}
            onSelectHeading={handleSelectHeading}
          />

          {/* Right Main Artifact Canvas Pane (Responsive Flex) */}
          <ArtifactCanvas
            artifact={activeArtifact}
            versions={versions}
            relationships={relationships}
            onSelectWikiLink={handleWikiLinkClick}
            onApprove={handleApproveArtifact}
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

      {activeTab === 'skills' && (
        <SkillRegistryView
          skills={skills}
          onSelectSkill={(id) => {
            handleSelectArtifact(id);
            setActiveTab('workspace');
          }}
        />
      )}

      {activeTab === 'approvals' && (
        <ApprovalsView
          pendingArtifacts={pendingArtifacts}
          onApprove={handleApproveArtifact}
          onReject={handleRejectArtifact}
          onSelectArtifact={(id) => {
            handleSelectArtifact(id);
            setActiveTab('workspace');
          }}
        />
      )}

      {activeTab === 'settings' && <SettingsView />}

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
    backgroundColor: tokens.colors.bgApp,
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
