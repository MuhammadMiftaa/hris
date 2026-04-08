import type {
  Branch,
  CreateBranchPayload,
  UpdateBranchPayload,
} from "@/types/branch";
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
// BRANCH API
// ════════════════════════════════════════════

/** GET /branches — List all branches */
export async function fetchBranches(token: string) {
  return apiCall<Branch[]>("/branches", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /branches/:id — Get branch by ID */
export async function fetchBranchById(token: string, id: number) {
  return apiCall<Branch>(`/branches/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /branches — Create a new branch */
export async function createBranch(
  token: string,
  payload: CreateBranchPayload,
) {
  return apiCall<Branch>("/branches", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /branches/:id — Update a branch */
export async function updateBranch(
  token: string,
  id: number,
  payload: UpdateBranchPayload,
) {
  return apiCall<Branch>(`/branches/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /branches/:id — Delete a branch */
export async function deleteBranch(token: string, id: number) {
  return apiCall<{ message: string }>(`/branches/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
