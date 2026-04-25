export type WorkLocationType = "office" | "home" | "outside";
export type OvertimeStatus = "pending" | "approved_leader" | "approved_hr" | "rejected";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface OvertimeApproval {
  id: number;
  overtime_request_id: number;
  approver_id: number;
  approver_name?: string;
  level: number;
  status: ApprovalStatus;
  notes: string | null;
  decided_at: string | null;
  created_at: string;
}

export interface OvertimeRequest {
  id: number;
  employee_id: number;
  employee_name?: string;
  attendance_log_id: number;
  overtime_date: string;
  planned_start: string | null;
  planned_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  planned_minutes: number;
  actual_minutes: number | null;
  reason: string;
  work_location_type: WorkLocationType;
  status: OvertimeStatus;
  approvals?: OvertimeApproval[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateOvertimePayload {
  employee_id?: number;
  attendance_log_id: number;
  overtime_date: string;
  planned_start?: string;
  planned_end?: string;
  planned_minutes: number;
  reason: string;
  work_location_type: WorkLocationType;
}

export interface ApproveOvertimePayload {
  notes?: string;
}

export interface RejectOvertimePayload {
  notes: string;
}

export interface OvertimeListParams {
  employee_id?: number;
  status?: OvertimeStatus;
}

export const WORK_LOCATION_OPTIONS: {
  value: WorkLocationType;
  label: string;
}[] = [
  { value: "office", label: "Kantor" },
  { value: "home", label: "Rumah" },
  { value: "outside", label: "Luar Kantor" },
];

export const OVERTIME_STATUS_OPTIONS: {
  value: OvertimeStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Menunggu", color: "yellow" },
  { value: "approved_leader", label: "Disetujui Leader", color: "blue" },
  { value: "approved_hr", label: "Disetujui HR", color: "green" },
  { value: "rejected", label: "Ditolak", color: "red" },
];
