import type {
  Role,
  Permission,
  CreateRolePayload,
  UpdateRolePayload,
  UpdateRolePermissionsPayload,
} from "@/types/role";
import type { ApiResponse, ApiError } from "./api";
import { API_URL } from "./const";

/** Fetch wrapper targeting the API */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.status === false) {
    const error: ApiError = {
      statusCode: data.statusCode || response.status,
      message: data.message || "Something went wrong",
    };
    throw error;
  }

  return data as ApiResponse<T>;
}

// ════════════════════════════════════════════
// ROLE API
// ════════════════════════════════════════════

/** GET /roles — List all roles */
export async function fetchRoles(token: string) {
  return apiCall<Role[]>("/roles", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /roles/:id — Get role by ID (with permissions) */
export async function fetchRoleById(token: string, id: number) {
  return apiCall<Role>(`/roles/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /roles — Create a new role */
export async function createRole(token: string, payload: CreateRolePayload) {
  return apiCall<Role>("/roles", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /roles/:id — Update a role */
export async function updateRole(
  token: string,
  id: number,
  payload: UpdateRolePayload,
) {
  return apiCall<Role>(`/roles/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /roles/:id — Delete a role */
export async function deleteRole(token: string, id: number) {
  return apiCall<{ message: string }>(`/roles/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// PERMISSION API
// ════════════════════════════════════════════

/** GET /permissions — List all permissions */
export async function fetchPermissions(token: string) {
  return apiCall<Permission[]>("/permissions", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** PUT /roles/:id/permissions — Update role permissions */
export async function updateRolePermissions(
  token: string,
  roleId: number,
  payload: UpdateRolePermissionsPayload,
) {
  return apiCall<Role>(`/roles/${roleId}/permissions`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}
