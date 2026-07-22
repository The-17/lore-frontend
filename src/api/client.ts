import type { Artifact, BYOBConfig, Collection, Relationship } from '../types';

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { baseUrl, token } = getBYOBConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }
  return response.json();
}

export const api = {
  // Collections
  getCollections: () => request<Collection[]>('/collections/'),
  createCollection: (data: { name: string; parent_id?: string }) =>
    request<Collection>('/collections/', { method: 'POST', body: JSON.stringify(data) }),

  // Artifacts
  getArtifacts: (collection_id?: string, type?: string) => {
    const params = new URLSearchParams();
    if (collection_id) params.append('collection_id', collection_id);
    if (type) params.append('type', type);
    return request<Artifact[]>(`/artifacts/?${params.toString()}`);
  },

  getArtifact: (id: string) => request<Artifact>(`/artifacts/${id}`),

  createArtifact: (data: Partial<Artifact>) =>
    request<Artifact>('/artifacts/', { method: 'POST', body: JSON.stringify(data) }),

  // Relationships / Graph
  getRelationships: (artifactId: string) =>
    request<Relationship[]>(`/artifacts/${artifactId}/relationships`),

  // Skill Registry
  getSkills: () => request<Artifact[]>('/artifacts/skills/list'),
  getSkillByTitle: (title: string) => request<Artifact>(`/artifacts/skills/${encodeURIComponent(title)}`),
};
