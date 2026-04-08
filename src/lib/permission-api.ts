import type {
  PermissionRequest,
  CreatePermissionPayload,
  UpdatePermissionStatusPayload,
  PermissionListParams,
} from "@/types/permission-request";
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

/** Build query string from params */
function buildQueryString<T extends object>(params?: T): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// ════════════════════════════════════════════
// PERMISSION REQUEST API
// ════════════════════════════════════════════

/** GET /permission-requests — List permission requests */
export async function fetchPermissionRequests(
  token: string,
  params?: PermissionListParams,
) {
  const query = buildQueryString(params);
  return apiCall<PermissionRequest[]>(`/permission-requests${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /permission-requests/:id — Get permission request by ID */
export async function fetchPermissionRequestById(token: string, id: number) {
  return apiCall<PermissionRequest>(`/permission-requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /permission-requests — Create a new permission request */
export async function createPermissionRequest(
  token: string,
  payload: CreatePermissionPayload,
) {
  return apiCall<PermissionRequest>("/permission-requests", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /permission-requests/:id — Update permission status (approve/reject) */
export async function updatePermissionStatus(
  token: string,
  id: number,
  payload: UpdatePermissionStatusPayload,
) {
  return apiCall<PermissionRequest>(`/permission-requests/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /permission-requests/:id — Delete a permission request */
export async function deletePermissionRequest(token: string, id: number) {
  return apiCall<null>(`/permission-requests/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
