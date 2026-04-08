import type {
  ShiftTemplate,
  ShiftTemplateDetail,
  CreateShiftPayload,
  UpdateShiftPayload,
  EmployeeSchedule,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  ScheduleListParams,
} from "@/types/shift";
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
// SHIFT TEMPLATE API
// ════════════════════════════════════════════

/** GET /shifts — List all shift templates */
export async function fetchShiftTemplates(token: string) {
  return apiCall<ShiftTemplate[]>("/shifts", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /shifts/:id — Get shift template by ID */
export async function fetchShiftTemplateById(token: string, id: number) {
  return apiCall<ShiftTemplate>(`/shifts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /shifts — Create a new shift template */
export async function createShiftTemplate(
  token: string,
  payload: CreateShiftPayload,
) {
  return apiCall<ShiftTemplate>("/shifts", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /shifts/:id — Update a shift template */
export async function updateShiftTemplate(
  token: string,
  id: number,
  payload: UpdateShiftPayload,
) {
  return apiCall<ShiftTemplate>(`/shifts/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /shifts/:id — Delete a shift template */
export async function deleteShiftTemplate(token: string, id: number) {
  return apiCall<{ message: string }>(`/shifts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /shifts/:id/details — Get details for a shift template */
export async function fetchShiftTemplateDetails(
  token: string,
  shiftId: number,
) {
  return apiCall<ShiftTemplateDetail[]>(`/shifts/${shiftId}/details`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// EMPLOYEE SCHEDULE API
// ════════════════════════════════════════════

/** GET /schedules — List all employee schedules */
export async function fetchEmployeeSchedules(
  token: string,
  params?: ScheduleListParams,
) {
  const searchParams = new URLSearchParams();
  if (params?.employee_id !== undefined) {
    searchParams.append("employee_id", String(params.employee_id));
  }
  if (params?.shift_template_id !== undefined) {
    searchParams.append("shift_template_id", String(params.shift_template_id));
  }
  if (params?.is_active !== undefined) {
    searchParams.append("is_active", String(params.is_active));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/schedules?${query}` : "/schedules";

  return apiCall<EmployeeSchedule[]>(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /schedules/:id — Get employee schedule by ID */
export async function fetchEmployeeScheduleById(token: string, id: number) {
  return apiCall<EmployeeSchedule>(`/schedules/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /schedules — Create a new employee schedule */
export async function createEmployeeSchedule(
  token: string,
  payload: CreateSchedulePayload,
) {
  return apiCall<EmployeeSchedule>("/schedules", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /schedules/:id — Update an employee schedule */
export async function updateEmployeeSchedule(
  token: string,
  id: number,
  payload: UpdateSchedulePayload,
) {
  return apiCall<EmployeeSchedule>(`/schedules/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /schedules/:id — Delete an employee schedule */
export async function deleteEmployeeSchedule(token: string, id: number) {
  return apiCall<{ message: string }>(`/schedules/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
