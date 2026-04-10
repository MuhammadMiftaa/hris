import type {
  MutabaahLog,
  MutabaahListParams,
  MutabaahTodayStatus,
  MutabaahSubmitPayload,
  MutabaahCancelPayload,
  MutabaahDailyReport,
  MutabaahMonthlySummary,
  MutabaahCategorySummary,
} from "@/types/mutabaah";
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
// MUTABA'AH API (§14)
// ════════════════════════════════════════════

/** GET /mutabaah — List mutabaah logs */
export async function fetchMutabaahLogs(
  token: string,
  params?: MutabaahListParams,
) {
  const query = buildQueryString(params);
  return apiCall<MutabaahLog[]>(`/mutabaah${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /mutabaah/today — Today's mutabaah status */
export async function fetchMutabaahToday(token: string) {
  return apiCall<MutabaahTodayStatus>("/mutabaah/today", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /mutabaah/submit — Submit tilawah hari ini */
export async function submitMutabaah(
  token: string,
  payload: MutabaahSubmitPayload,
) {
  return apiCall<MutabaahLog>("/mutabaah/submit", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** POST /mutabaah/cancel — Cancel tilawah */
export async function cancelMutabaah(
  token: string,
  payload: MutabaahCancelPayload,
) {
  return apiCall<MutabaahLog>("/mutabaah/cancel", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** GET /mutabaah/report/daily — Laporan harian */
export async function fetchMutabaahDailyReport(token: string, date: string) {
  return apiCall<MutabaahDailyReport[]>(
    `/mutabaah/report/daily?date=${date}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

/** GET /mutabaah/report/monthly — Laporan bulanan */
export async function fetchMutabaahMonthlyReport(
  token: string,
  month: number,
  year: number,
) {
  return apiCall<MutabaahMonthlySummary[]>(
    `/mutabaah/report/monthly?month=${month}&year=${year}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

/** GET /mutabaah/report/category — Perbandingan kategori */
export async function fetchMutabaahCategoryReport(
  token: string,
  date: string,
) {
  return apiCall<MutabaahCategorySummary[]>(
    `/mutabaah/report/category?date=${date}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}
