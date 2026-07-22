import React, { useState } from 'react';
import type { Artifact } from '../types';
import { Cpu, Search, Copy, Check, ExternalLink } from 'lucide-react';

interface SkillRegistryViewProps {
  skills: Artifact[];
  onSelectSkill: (id: string) => void;
}

export const SkillRegistryView: React.FC<SkillRegistryViewProps> = ({
  skills,
  onSelectSkill,
}) => {
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSkills = skills.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      (s.skill_md_content && s.skill_md_content.toLowerCase().includes(query.toLowerCase()))
  );

  const handleCopyPrompt = (id: string, title: string) => {
    navigator.clipboard.writeText(`[[${title}]]`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={22} color="var(--accent-emerald)" />
            <h2 style={styles.title}>Dynamic Skill Registry</h2>
          </div>
          <p style={styles.subtitle}>
            Prompt-hydrated skills accessible to AI agents. Agents fetch these skills on-demand to keep context windows small.
          </p>
        </div>

        {/* Search Bar */}
        <div style={styles.searchWrapper}>
          <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills by title or prompt instructions..."
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div style={styles.grid}>
        {filteredSkills.map((skill) => (
          <div key={skill.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.skillTitle}>{skill.title}</h3>
              <span style={styles.usageBadge}>
                ⚡ {skill.usage_count || 0} Hydrations
              </span>
            </div>

            <p style={styles.snippet}>
              {skill.skill_md_content?.slice(0, 140) || 'No prompt instructions defined.'}...
            </p>

            <div style={styles.cardFooter}>
              <button
                onClick={() => onSelectSkill(skill.id)}
                style={styles.viewBtn}
              >
                <ExternalLink size={14} style={{ marginRight: '4px' }} /> View Full Skill
              </button>
              <button
                onClick={() => handleCopyPrompt(skill.id, skill.title)}
                style={styles.copyBtn}
              >
                {copiedId === skill.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === skill.id ? 'Copied!' : 'Copy Wiki-Link'}
              </button>
            </div>
          </div>
        ))}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '4px',
    maxWidth: '520px',
  },
  searchWrapper: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: '10px',
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    width: '320px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '14px',
    border: '1px solid var(--border-card)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  skillTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
  },
  usageBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--accent-emerald)',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    padding: '2px 8px',
    borderRadius: '12px',
    whiteSpace: 'nowrap',
  },
  snippet: {
    fontSize: '13px',
    color: '#a1a1aa',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-card)',
  },
  viewBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  copyBtn: {
    background: 'var(--bg-tube)',
    border: '1px solid var(--border-card)',
    color: '#ffffff',
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};
