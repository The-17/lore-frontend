export type ArtifactType = 'document' | 'skill' | 'decision' | 'memory';
export type LifecycleState = 'draft' | 'under_review' | 'approved' | 'rejected' | 'archived';

export interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  lifecycle_state: LifecycleState;
  collection_id?: string | null;
  current_version_number?: number;
  created_at: string;
  updated_at: string;
  owner_id?: string;
  created_by_id?: string;
  content?: string;
  skill_md_content?: string;
  decision_text?: string;
  rationale?: string;
  usage_count?: number;
}

export interface Collection {
  id: string;
  name: string;
  parent_id?: string | null;
  inherit_permissions: boolean;
  created_at: string;
}

export interface ArtifactVersion {
  id: string;
  version_number: number;
  commit_message: string;
  created_at: string;
  created_by_id?: string;
  diff_content?: string;
}

export interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  relation_type: string;
  target_title?: string;
}

export interface BYOBConfig {
  baseUrl: string;
  token?: string;
}
