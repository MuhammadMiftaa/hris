import type {
  Holiday,
  CreateHolidayPayload,
  UpdateHolidayPayload,
  HolidayListParams,
} from "@/types/holiday";
import type { ApiResponse, ApiError } from "./api";
import { BFF_BASE_URL } from "./const";

/** Fetch wrapper targeting the BFF */
async function bffCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BFF_BASE_URL}${endpoint}`, {
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
// HOLIDAY API
// ════════════════════════════════════════════

/** GET /holidays — List all holidays */
export async function fetchHolidays(token: string, params?: HolidayListParams) {
  const searchParams = new URLSearchParams();
  if (params?.year !== undefined) {
    searchParams.append("year", String(params.year));
  }
  if (params?.type !== undefined) {
    searchParams.append("type", params.type);
  }
  if (params?.branch_id !== undefined) {
    searchParams.append("branch_id", String(params.branch_id));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/holidays?${query}` : "/holidays";

  return bffCall<Holiday[]>(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /holidays/:id — Get holiday by ID */
export async function fetchHolidayById(token: string, id: number) {
  return bffCall<Holiday>(`/holidays/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /holidays — Create a new holiday */
export async function createHoliday(
  token: string,
  payload: CreateHolidayPayload,
) {
  return bffCall<Holiday>("/holidays", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /holidays/:id — Update a holiday */
export async function updateHoliday(
  token: string,
  id: number,
  payload: UpdateHolidayPayload,
) {
  return bffCall<Holiday>(`/holidays/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /holidays/:id — Delete a holiday */
export async function deleteHoliday(token: string, id: number) {
  return bffCall<{ message: string }>(`/holidays/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
