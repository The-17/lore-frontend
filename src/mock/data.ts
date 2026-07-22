import type { Artifact, Collection, Relationship, ArtifactVersion } from '../types';

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-eng',
    name: 'Engineering',
    parent_id: null,
    inherit_permissions: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'col-backend',
    name: 'Backend Services',
    parent_id: 'col-eng',
    inherit_permissions: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'col-arch',
    name: 'Architecture Decisions',
    parent_id: 'col-eng',
    inherit_permissions: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'col-research',
    name: 'AI Agent Research',
    parent_id: null,
    inherit_permissions: false,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: 'art-decision-1',
    title: 'Adopt Django Ninja Framework',
    type: 'decision',
    lifecycle_state: 'approved',
    collection_id: 'col-arch',
    current_version_number: 2,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    rationale: 'Pydantic schema validation, automatic OpenAPI spec generation, and fast execution speeds over traditional DRF serializers.',
    decision_text: `# Architecture Decision: Adopt Django Ninja

We have formally decided to standardize all Lore backend APIs on **Django Ninja**.

## Key Integration Points
* Every API endpoint must return typed Pydantic response schemas.
* Authentication middleware will resolve both JWT Bearer tokens and [[Agent Token Security]] headers into a unified Principal identity.
* Standardized API routes will reference [[Django Ninja Patterns]] for all error handling.

## Impact
Improves API performance by 3x and simplifies automated OpenAPI spec generation for AI agent tool integration.`,
  },
  {
    id: 'art-skill-1',
    title: 'Django Ninja Patterns',
    type: 'skill',
    lifecycle_state: 'approved',
    collection_id: 'col-backend',
    current_version_number: 1,
    usage_count: 42,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    skill_md_content: `# Skill: Django Ninja Patterns

Instructions for AI Agents generating API endpoints in the Lore codebase.

## Code Conventions
\`\`\`python
from ninja import Router, Schema
from typing import Any, Dict

router = Router(tags=["Artifacts"])

class ArtifactResponseSchema(Schema):
    id: str
    title: str
    type: str

@router.get("/{artifact_id}", response=ArtifactResponseSchema)
def get_artifact(request, artifact_id: str):
    return get_object_or_404(Artifact, id=artifact_id)
\`\`\`

Always wrap request body dictionaries in explicit \`Schema\` subclasses to prevent query parameter parsing ambiguity.`,
  },
  {
    id: 'art-doc-1',
    title: 'PostgreSQL Schema & Vector Indexing',
    type: 'document',
    lifecycle_state: 'under_review',
    collection_id: 'col-backend',
    current_version_number: 3,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    content: `# PostgreSQL Schema & Vector Storage

Specification for the Lore database architecture using PostgreSQL and \`pgvector\`.

## Table Design
1. **\`Artifact\` Table**: Main metadata entity with owner and collection relationships.
2. **\`ArtifactChunk\` Table**: 500-character sliding-window text blocks linked to specific \`ArtifactVersion\` rows.
3. **\`ArtifactRelationship\` Table**: Directed graph edges between artifacts matching [[Adopt Django Ninja Framework]].

## Vector Search Indexing
\`\`\`sql
CREATE INDEX idx_artifact_chunks_embedding 
ON apps_artifacts_artifactchunk 
USING ivfflat (embedding vector_cosine_ops);
\`\`\``,
  },
  {
    id: 'art-memory-1',
    title: 'Agent Token Security',
    type: 'memory',
    lifecycle_state: 'draft',
    collection_id: 'col-research',
    current_version_number: 1,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 600000).toISOString(),
    content: `# Memory: Agent Token Security Specs

Persistent scratchpad regarding AI Agent access tokens.

* Agent tokens use the prefix \`lore_agent_\`.
* Only the SHA-256 hash of the token (\`token_hash\`) is stored in the database.
* Tokens are scoped to specific collections and carry granular permissions (\`read_only\`, \`read_write\`).`,
  },
];

export const MOCK_RELATIONSHIPS: Relationship[] = [
  {
    id: 'rel-1',
    source_id: 'art-decision-1',
    target_id: 'art-skill-1',
    relation_type: 'references',
    target_title: 'Django Ninja Patterns',
  },
  {
    id: 'rel-2',
    source_id: 'art-decision-1',
    target_id: 'art-memory-1',
    relation_type: 'references',
    target_title: 'Agent Token Security',
  },
  {
    id: 'rel-3',
    source_id: 'art-doc-1',
    target_id: 'art-decision-1',
    relation_type: 'derived_from',
    target_title: 'Adopt Django Ninja Framework',
  },
];

export const MOCK_VERSIONS: ArtifactVersion[] = [
  {
    id: 'ver-1',
    version_number: 1,
    commit_message: 'Initial architecture draft',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    diff_content: 'Initial document snapshot created.',
  },
  {
    id: 'ver-2',
    version_number: 2,
    commit_message: 'Add wiki-links to Agent Token Security and Ninja Patterns',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    diff_content: `@@ -4,6 +4,8 @@
- Standardized API routes will use DRF endpoints.
+ Standardized API routes will reference [[Django Ninja Patterns]] for all error handling.
+ Authentication middleware will resolve both JWT Bearer tokens and [[Agent Token Security]] headers.`,
  },
];
