import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  DepartmentListParams,
} from "@/types/department";
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
// DEPARTMENT API
// ════════════════════════════════════════════

/** GET /departments — List all departments */
export async function fetchDepartments(
  token: string,
  params?: DepartmentListParams,
) {
  const searchParams = new URLSearchParams();
  if (params?.branch_id !== undefined) {
    searchParams.append("branch_id", String(params.branch_id));
  }
  if (params?.is_active !== undefined) {
    searchParams.append("is_active", String(params.is_active));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/departments?${query}` : "/departments";

  return apiCall<Department[]>(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /departments/:id — Get department by ID */
export async function fetchDepartmentById(token: string, id: number) {
  return apiCall<Department>(`/departments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /departments — Create a new department */
export async function createDepartment(
  token: string,
  payload: CreateDepartmentPayload,
) {
  return apiCall<Department>("/departments", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /departments/:id — Update a department */
export async function updateDepartment(
  token: string,
  id: number,
  payload: UpdateDepartmentPayload,
) {
  return apiCall<Department>(`/departments/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /departments/:id — Delete a department */
export async function deleteDepartment(token: string, id: number) {
  return apiCall<{ message: string }>(`/departments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
