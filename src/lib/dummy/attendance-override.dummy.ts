import type {
  AttendanceOverride,
  OverrideListParams,
} from "@/types/attendance-override";

// ════════════════════════════════════════════
// ATTENDANCE OVERRIDE DUMMY DATA
// ════════════════════════════════════════════

const getDateString = (daysAgo: number): string => {
  const date = new Date("2026-04-07");
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getTimestamp = (dateStr: string, time: string): string => {
  return `${dateStr}T${time}:00Z`;
};

export const DUMMY_ATTENDANCE_OVERRIDES: AttendanceOverride[] = [
  // Pending - koreksi jam masuk
  {
    id: 1,
    attendance_log_id: 5, // late entry
    attendance_date: getDateString(4),
    requested_by: 5,
    requester_name: "Muhammad Rizki",
    approved_by: null,
    approver_name: undefined,
    override_type: "clock_in",
    original_clock_in: getTimestamp(getDateString(4), "08:35"),
    original_clock_out: getTimestamp(getDateString(4), "17:10"),
    corrected_clock_in: getTimestamp(getDateString(4), "07:55"),
    corrected_clock_out: null,
    reason:
      "Lupa clock in, sudah tiba di kantor pukul 07:55 (ada saksi rekan kerja)",
    status: "pending",
    created_at: getTimestamp(getDateString(3), "09:00"),
    updated_at: getTimestamp(getDateString(3), "09:00"),
    deleted_at: null,
  },
  // Approved - koreksi jam keluar
  {
    id: 2,
    attendance_log_id: 13, // late entry that was corrected
    attendance_date: getDateString(12),
    requested_by: 2,
    requester_name: "Fatimah Azzahra",
    approved_by: 1,
    approver_name: "Ahmad Fauzan",
    override_type: "clock_out",
    original_clock_in: getTimestamp(getDateString(12), "08:15"),
    original_clock_out: getTimestamp(getDateString(12), "17:00"),
    corrected_clock_in: null,
    corrected_clock_out: getTimestamp(getDateString(12), "18:30"),
    reason: "Lupa clock out karena meeting mendadak, keluar kantor pukul 18:30",
    status: "approved",
    created_at: getTimestamp(getDateString(11), "08:30"),
    updated_at: getTimestamp(getDateString(10), "10:00"),
    deleted_at: null,
  },
  // Rejected - koreksi penuh
  {
    id: 3,
    attendance_log_id: 15, // absent
    attendance_date: getDateString(14),
    requested_by: 5,
    requester_name: "Muhammad Rizki",
    approved_by: 2,
    approver_name: "Fatimah Azzahra",
    override_type: "full_day",
    original_clock_in: null,
    original_clock_out: null,
    corrected_clock_in: getTimestamp(getDateString(14), "08:00"),
    corrected_clock_out: getTimestamp(getDateString(14), "17:00"),
    reason: "Sistem error, tidak bisa clock in/out melalui aplikasi",
    status: "rejected",
    created_at: getTimestamp(getDateString(13), "09:00"),
    updated_at: getTimestamp(getDateString(12), "14:00"),
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// GETTER FUNCTIONS
// ════════════════════════════════════════════

export function getDummyAttendanceOverrides(
  params?: OverrideListParams,
): AttendanceOverride[] {
  let result = [...DUMMY_ATTENDANCE_OVERRIDES];

  if (params?.employee_id) {
    result = result.filter(
      (override) => override.requested_by === params.employee_id,
    );
  }

  if (params?.status) {
    result = result.filter((override) => override.status === params.status);
  }

  // Sort by created_at descending (newest first)
  result.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return result;
}

export function getDummyAttendanceOverrideById(
  id: number,
): AttendanceOverride | null {
  return (
    DUMMY_ATTENDANCE_OVERRIDES.find((override) => override.id === id) ?? null
  );
}
