import type {
  OvertimeRequest,
  CreateOvertimePayload,
  ApproveOvertimePayload,
  RejectOvertimePayload,
  OvertimeListParams,
} from "@/types/overtime";
import { apiCall } from "@/lib/api";

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
  params?: OvertimeListParams,
) {
  const query = buildQueryString(params);
  return apiCall<OvertimeRequest[]>(`/overtime-requests${query}`);
}

/** GET /overtime-requests/:id — Get overtime request by ID */
export async function fetchOvertimeRequestById(id: number) {
  return apiCall<OvertimeRequest>(`/overtime-requests/${id}`);
}

/** POST /overtime-requests — Create a new overtime request */
export async function createOvertimeRequest(
  payload: CreateOvertimePayload,
) {
  return apiCall<OvertimeRequest>("/overtime-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /overtime-requests/:id/approve — Approve overtime request */
export async function approveOvertimeRequest(
  id: number,
  payload: ApproveOvertimePayload,
) {
  return apiCall<OvertimeRequest>(`/overtime-requests/${id}/approve`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** POST /overtime-requests/:id/reject — Reject overtime request */
export async function rejectOvertimeRequest(
  id: number,
  payload: RejectOvertimePayload,
) {
  return apiCall<OvertimeRequest>(`/overtime-requests/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /overtime-requests/:id — Delete an overtime request */
export async function deleteOvertimeRequest(id: number) {
  return apiCall<null>(`/overtime-requests/${id}`, {
    method: "DELETE",
  });
}
