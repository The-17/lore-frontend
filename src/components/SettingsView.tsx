import React, { useState } from 'react';
import { Settings, Key, Shield, Plus, Trash2 } from 'lucide-react';
import { getBYOBConfig, setBYOBConfig } from '../api/client';

export const SettingsView: React.FC = () => {
  const currentConfig = getBYOBConfig();
  const [baseUrl, setBaseUrl] = useState(currentConfig.baseUrl);
  const [token, setToken] = useState(currentConfig.token || '');
  const [saved, setSaved] = useState(false);

  const [agentTokens, setAgentTokens] = useState([
    { id: 'tok-1', prefix: 'lore_agent_8f9a', description: 'Claude Desktop Agent', scope: 'read_write', created: '2026-07-20' },
    { id: 'tok-2', prefix: 'lore_agent_3b1c', description: 'Cursor CLI Runner', scope: 'read_only', created: '2026-07-21' },
  ]);

  const handleSaveBYOB = (e: React.FormEvent) => {
    e.preventDefault();
    setBYOBConfig(baseUrl, token);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRevokeToken = (id: string) => {
    setAgentTokens(agentTokens.filter((t) => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={22} color="var(--accent-blue)" />
          <h2 style={styles.title}>Workspace Settings</h2>
        </div>
        <p style={styles.subtitle}>
          Configure your self-hosted BYOB backend endpoint and issue scoped agent tokens.
        </p>
      </div>

      <div style={styles.sections}>
        {/* BYOB Connection Config */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <Shield size={18} color="var(--accent-emerald)" />
            <h3>Self-Hosted Backend URL (BYOB)</h3>
          </div>
          <form onSubmit={handleSaveBYOB} style={styles.form}>
            <label style={styles.label}>
              <span>API Base URL</span>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              <span>Authorization JWT Bearer Token</span>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={styles.input}
              />
            </label>
            <button type="submit" style={styles.saveBtn}>
              {saved ? 'Settings Saved!' : 'Save Connection'}
            </button>
          </form>
        </div>

        {/* Agent Token Manager */}
        <div style={styles.card}>
          <div style={{ ...styles.cardTitle, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} color="var(--accent-purple)" />
              <h3>Scoped Agent Access Tokens</h3>
            </div>
            <button style={styles.createTokenBtn}>
              <Plus size={14} style={{ marginRight: '4px' }} /> Issue New Token
            </button>
          </div>

          <div style={styles.tokenList}>
            {agentTokens.map((tok) => (
              <div key={tok.id} style={styles.tokenRow}>
                <div>
                  <div style={styles.tokenPrefix}>{tok.prefix}...</div>
                  <div style={styles.tokenDesc}>{tok.description} ({tok.scope})</div>
                </div>
                <button onClick={() => handleRevokeToken(tok.id)} style={styles.revokeBtn}>
                  <Trash2 size={14} /> Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'var(--bg-app)',
    padding: '32px',
    overflowY: 'auto',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '720px',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '14px',
    border: '1px solid var(--border-card)',
    padding: '24px',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    color: '#ffffff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px',
    color: '#e4e4e7',
  },
  input: {
    backgroundColor: '#18181b',
    border: '1px solid var(--border-card)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#ffffff',
    fontSize: '14px',
  },
  saveBtn: {
    backgroundColor: 'var(--accent-emerald)',
    border: 'none',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  createTokenBtn: {
    backgroundColor: 'var(--bg-tube)',
    border: '1px solid var(--border-card)',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  tokenList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  tokenRow: {
    backgroundColor: '#18181b',
    padding: '12px 16px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenPrefix: {
    fontSize: '14px',
    fontFamily: 'monospace',
    color: 'var(--accent-purple)',
  },
  tokenDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  revokeBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};
