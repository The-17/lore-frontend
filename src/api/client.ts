import type { Artifact, BYOBConfig, Collection, Relationship } from '../types';
import { MOCK_ARTIFACTS, MOCK_COLLECTIONS, MOCK_RELATIONSHIPS, MOCK_VERSIONS } from '../mock/data';

const DEFAULT_BASE_URL = 'http://127.0.0.1:8000/api';

export function getBYOBConfig(): BYOBConfig {
  const baseUrl = localStorage.getItem('lore_backend_url') || DEFAULT_BASE_URL;
  const token = localStorage.getItem('lore_token') || undefined;
  return { baseUrl, token };
}

export function setBYOBConfig(baseUrl: string, token?: string) {
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  localStorage.setItem('lore_backend_url', cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`);
  if (token) {
    localStorage.setItem('lore_token', token);
  } else {
    localStorage.removeItem('lore_token');
  }
}

async function request<T>(path: string, fallbackData: T, options: RequestInit = {}): Promise<T> {
  const { baseUrl, token } = getBYOBConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
    if (!response.ok) {
      console.warn(`API responded with ${response.status}, using mock data for ${path}`);
      return fallbackData;
    }
    return await response.json();
  } catch (err) {
    console.warn(`Backend offline or unreachable (${path}), rendering mock dataset:`, err);
    return fallbackData;
  }
}

export const api = {
  // Collections
  getCollections: () => request<Collection[]>('/collections/', MOCK_COLLECTIONS),
  createCollection: (data: { name: string; parent_id?: string }) =>
    request<Collection>('/collections/', { id: `col-${Date.now()}`, name: data.name, inherit_permissions: false, created_at: new Date().toISOString() }, { method: 'POST', body: JSON.stringify(data) }),

  // Artifacts
  getArtifacts: (collection_id?: string, type?: string) => {
    let filtered = MOCK_ARTIFACTS;
    if (collection_id) filtered = filtered.filter((a) => a.collection_id === collection_id);
    if (type) filtered = filtered.filter((a) => a.type === type);
    return request<Artifact[]>('/artifacts/', filtered);
  },

  getArtifact: (id: string) => {
    const found = MOCK_ARTIFACTS.find((a) => a.id === id) || MOCK_ARTIFACTS[0];
    return request<Artifact>(`/artifacts/${id}`, found);
  },

  getArtifactVersions: (id: string) => {
    return request<any[]>(`/artifacts/${id}/versions`, MOCK_VERSIONS);
  },

  createArtifact: (data: Partial<Artifact>) =>
    request<Artifact>('/artifacts/', { id: `art-${Date.now()}`, title: data.title || 'Untitled', type: data.type || 'document', lifecycle_state: 'draft', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { method: 'POST', body: JSON.stringify(data) }),

  // Relationships / Graph
  getRelationships: (artifactId: string) =>
    request<Relationship[]>(`/artifacts/${artifactId}/relationships`, MOCK_RELATIONSHIPS),

  // Skill Registry
  getSkills: () => request<Artifact[]>('/artifacts/skills/list', MOCK_ARTIFACTS.filter((a) => a.type === 'skill')),
  getSkillByTitle: (title: string) => {
    const found = MOCK_ARTIFACTS.find((a) => a.title.toLowerCase() === title.toLowerCase()) || MOCK_ARTIFACTS[1];
    return request<Artifact>(`/artifacts/skills/${encodeURIComponent(title)}`, found);
  },
};
