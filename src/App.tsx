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
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  // Clean HTML5 History API Path Navigation (Zero Hash '#' Symbols)
  const navigateToPath = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      parseCurrentPath(path);
    }
  };

  // Parse window.location.pathname into React state
  const parseCurrentPath = (pathnameStr: string) => {
    const rawPath = pathnameStr.replace(/^\/+/, '');
    if (!rawPath) {
      setActiveTab('workspace');
      setIsDiffOpen(false);
      return;
    }

    const parts = rawPath.split('/');
    const root = parts[0];

    if (root === 'graph' || root === 'skills' || root === 'approvals' || root === 'settings') {
      setActiveTab(root);
      setIsDiffOpen(false);
    } else if (root === 'workspace') {
      setActiveTab('workspace');
      setIsDiffOpen(false);
    } else if (root === 'artifacts' && parts[1]) {
      setActiveTab('workspace');
      const artifactId = parts[1];
      const isDiff = parts[2] === 'diff';
      setIsDiffOpen(isDiff);

      if (artifacts.length > 0) {
        const found = artifacts.find((a) => a.id === artifactId || a.id.startsWith(artifactId));
        if (found) {
          setActiveArtifact(found);
        }
      }
    }
  };

  // Listen to browser Back / Forward history popstate events
  useEffect(() => {
    const handlePopState = () => {
      parseCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    // Initial load path parsing
    parseCurrentPath(window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [artifacts]);

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
          const currentPath = window.location.pathname.replace(/^\/+/, '');
          const parts = currentPath.split('/');
          if (parts[0] === 'artifacts' && parts[1]) {
            const found = artsData.find((a) => a.id === parts[1] || a.id.startsWith(parts[1]));
            if (found) setActiveArtifact(found);
            else setActiveArtifact(artsData[0]);
          } else {
            setActiveArtifact(artsData[0]);
          }
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

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'workspace') {
      const artId = activeArtifact?.id || '7087ed86';
      const path = isDiffOpen ? `/artifacts/${artId}/diff` : `/artifacts/${artId}`;
      navigateToPath(path);
    } else {
      navigateToPath(`/${tab}`);
    }
  };

  const handleSelectArtifact = (id: string) => {
    const found = artifacts.find((a) => a.id === id);
    if (found) {
      setActiveArtifact(found);
      navigateToPath(`/artifacts/${found.id}${isDiffOpen ? '/diff' : ''}`);
    } else {
      api.getArtifact(id).then((art) => {
        setActiveArtifact(art);
        navigateToPath(`/artifacts/${art.id}${isDiffOpen ? '/diff' : ''}`);
      }).catch(console.error);
    }
  };

  const handleWikiLinkClick = (title: string) => {
    const found = artifacts.find((a) => a.title.toLowerCase() === title.toLowerCase());
    if (found) {
      setActiveArtifact(found);
      navigateToPath(`/artifacts/${found.id}`);
    } else {
      api.getSkillByTitle(title).then((art) => {
        setActiveArtifact(art);
        navigateToPath(`/artifacts/${art.id}`);
      }).catch(console.error);
    }
    setActiveTab('workspace');
    setIsDiffOpen(false);
  };

  const handleToggleDiffState = (open: boolean) => {
    setIsDiffOpen(open);
    const artId = activeArtifact?.id || '7087ed86';
    if (open) {
      navigateToPath(`/artifacts/${artId}/diff`);
    } else {
      navigateToPath(`/artifacts/${artId}`);
    }
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
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        setActiveTab={handleSelectTab}
        onOpenBYOBModal={() => setIsBYOBOpen(true)}
      />

      {/* Main View Area: Two Column Resizable Grid */}
      {activeTab === 'workspace' && (
        <div style={styles.workspaceSplit}>
          {/* Left Sidebar Pane with Dynamic TOC / Changed Sections and Resizable Handle */}
          <LeftSidebarPane
            width={sidebarWidth}
            onWidthChange={setSidebarWidth}
            isDiffOpen={isDiffOpen}
            activeHeadingId={activeHeadingId}
            onSelectHeading={handleSelectHeading}
          />

          {/* Right Main Artifact Canvas Pane (Responsive Flex) */}
          <ArtifactCanvas
            artifact={activeArtifact}
            versions={versions}
            relationships={relationships}
            isDiffOpen={isDiffOpen}
            onToggleDiff={handleToggleDiffState}
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
