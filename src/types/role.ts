// ════════════════════════════════════════════
// ROLE & PERMISSION TYPES
// ════════════════════════════════════════════

import type { MetaItem } from "./meta";

export type RoleLevel = "superadmin" | "admin" | "manager" | "staff";

export interface Role {
  id: number;
  name: string;
  level: RoleLevel;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined fields for display
  permissions?: Permission[];
  permission_count?: number;
}

export interface Permission {
  code: string;
  module: string;
  action: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RolePermission {
  id: number;
  role_id: number;
  permission_code: string;
  created_at: string;
}

export interface CreateRolePayload {
  name: string;
  level: RoleLevel;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  level?: RoleLevel;
  description?: string;
}

export interface UpdateRolePermissionsPayload {
  permission_codes: string[];
}

export interface RoleMetadata {
  module_meta: MetaItem[];
  action_meta: MetaItem[];
  level_meta: MetaItem[];
}


