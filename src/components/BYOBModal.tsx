import React, { useState } from 'react';
import { getBYOBConfig, setBYOBConfig } from '../api/client';
import { Server, Check, X } from 'lucide-react';

interface BYOBModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BYOBModal: React.FC<BYOBModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getBYOBConfig();
  const [baseUrl, setBaseUrl] = useState(currentConfig.baseUrl);
  const [token, setToken] = useState(currentConfig.token || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setBYOBConfig(baseUrl, token);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
      window.location.reload();
    }, 800);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={20} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>BYOB Backend Connection</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        <p style={styles.desc}>
          Bring Your Own Backend: Enter your self-hosted Lore backend base URL and optional JWT / Agent Access Token.
        </p>

        <form onSubmit={handleSave} style={styles.form}>
          <label style={styles.label}>
            <span>Backend Base URL</span>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000/api"
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            <span>Access Token / Agent Token (Optional)</span>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1Ni..."
              style={styles.input}
            />
          </label>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              {saved ? <Check size={16} style={{ marginRight: '6px' }} /> : null}
              {saved ? 'Saved!' : 'Save & Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-card)',
    padding: '28px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  desc: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '20px',
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
    fontWeight: '500',
    color: '#e4e4e7',
  },
  input: {
    backgroundColor: '#18181b',
    border: '1px solid var(--border-card)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '12px',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid var(--border-card)',
    color: 'var(--text-muted)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  saveBtn: {
    background: 'var(--accent-emerald)',
    border: 'none',
    color: '#ffffff',
    padding: '8px 18px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
};
