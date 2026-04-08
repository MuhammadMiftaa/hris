import type {
  OvertimeRequest,
  CreateOvertimePayload,
  UpdateOvertimeStatusPayload,
  OvertimeListParams,
} from "@/types/overtime";
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
// OVERTIME REQUEST API
// ════════════════════════════════════════════

/** GET /overtime-requests — List overtime requests */
export async function fetchOvertimeRequests(
  token: string,
  params?: OvertimeListParams,
) {
  const query = buildQueryString(params);
  return apiCall<OvertimeRequest[]>(`/overtime-requests${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /overtime-requests/:id — Get overtime request by ID */
export async function fetchOvertimeRequestById(token: string, id: number) {
  return apiCall<OvertimeRequest>(`/overtime-requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /overtime-requests — Create a new overtime request */
export async function createOvertimeRequest(
  token: string,
  payload: CreateOvertimePayload,
) {
  return apiCall<OvertimeRequest>("/overtime-requests", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /overtime-requests/:id — Update overtime status (approve/reject) */
export async function updateOvertimeStatus(
  token: string,
  id: number,
  payload: UpdateOvertimeStatusPayload,
) {
  return apiCall<OvertimeRequest>(`/overtime-requests/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /overtime-requests/:id — Delete an overtime request */
export async function deleteOvertimeRequest(token: string, id: number) {
  return apiCall<null>(`/overtime-requests/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
