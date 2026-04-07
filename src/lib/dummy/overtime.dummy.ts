import type { OvertimeRequest, OvertimeListParams } from "@/types/overtime";

// ════════════════════════════════════════════
// OVERTIME REQUEST DUMMY DATA
// ════════════════════════════════════════════

const getDateString = (daysAgo: number): string => {
  const date = new Date("2026-04-07");
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getTimestamp = (dateStr: string, time: string): string => {
  return `${dateStr}T${time}:00Z`;
};

export const DUMMY_OVERTIME_REQUESTS: OvertimeRequest[] = [
  // Approved - planned overtime (linked to attendance_logs id 19 with overtime_minutes)
  {
    id: 1,
    employee_id: 3,
    employee_name: "Usman Hakim",
    attendance_log_id: 19,
    overtime_date: getDateString(18),
    planned_start: getTimestamp(getDateString(18), "17:00"),
    planned_end: getTimestamp(getDateString(18), "19:00"),
    actual_start: getTimestamp(getDateString(18), "17:00"),
    actual_end: getTimestamp(getDateString(18), "19:00"),
    planned_minutes: 120,
    actual_minutes: 120,
    reason:
      "Menyelesaikan laporan keuangan bulanan yang harus selesai hari ini",
    work_location_type: "office",
    status: "approved",
    approved_by: 2,
    approver_name: "Fatimah Azzahra",
    approver_notes: "Disetujui",
    created_at: getTimestamp(getDateString(19), "14:00"),
    updated_at: getTimestamp(getDateString(18), "09:00"),
    deleted_at: null,
  },
  // Pending - planned overtime
  {
    id: 2,
    employee_id: 4,
    employee_name: "Aisyah Rahmawati",
    attendance_log_id: 25,
    overtime_date: getDateString(-1), // besok
    planned_start: getTimestamp(getDateString(-1), "17:00"),
    planned_end: getTimestamp(getDateString(-1), "20:00"),
    actual_start: null,
    actual_end: null,
    planned_minutes: 180,
    actual_minutes: null,
    reason: "Persiapan event company gathering",
    work_location_type: "office",
    status: "pending",
    approved_by: null,
    approver_name: undefined,
    approver_notes: null,
    created_at: getTimestamp(getDateString(0), "10:00"),
    updated_at: getTimestamp(getDateString(0), "10:00"),
    deleted_at: null,
  },
  // Approved - work from home overtime
  {
    id: 3,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    attendance_log_id: 17,
    overtime_date: getDateString(16),
    planned_start: getTimestamp(getDateString(16), "19:00"),
    planned_end: getTimestamp(getDateString(16), "21:00"),
    actual_start: getTimestamp(getDateString(16), "19:00"),
    actual_end: getTimestamp(getDateString(16), "21:30"),
    planned_minutes: 120,
    actual_minutes: 150,
    reason: "Review dan approval dokumen karyawan baru",
    work_location_type: "home",
    status: "approved",
    approved_by: 1,
    approver_name: "Ahmad Fauzan",
    approver_notes: "Disetujui, terima kasih atas kerja kerasnya",
    created_at: getTimestamp(getDateString(17), "16:00"),
    updated_at: getTimestamp(getDateString(16), "08:00"),
    deleted_at: null,
  },
  // Rejected
  {
    id: 4,
    employee_id: 5,
    employee_name: "Muhammad Rizki",
    attendance_log_id: 21,
    overtime_date: getDateString(20),
    planned_start: getTimestamp(getDateString(20), "17:00"),
    planned_end: getTimestamp(getDateString(20), "22:00"),
    actual_start: null,
    actual_end: null,
    planned_minutes: 300,
    actual_minutes: null,
    reason: "Menyelesaikan tugas yang tertunda",
    work_location_type: "outside",
    status: "rejected",
    approved_by: 2,
    approver_name: "Fatimah Azzahra",
    approver_notes:
      "Tidak disetujui, durasi terlalu lama. Silakan ajukan ulang dengan durasi yang lebih wajar atau split menjadi beberapa hari.",
    created_at: getTimestamp(getDateString(21), "15:00"),
    updated_at: getTimestamp(getDateString(20), "09:00"),
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// GETTER FUNCTIONS
// ════════════════════════════════════════════

export function getDummyOvertimeRequests(
  params?: OvertimeListParams,
): OvertimeRequest[] {
  let result = [...DUMMY_OVERTIME_REQUESTS];

  if (params?.employee_id) {
    result = result.filter((ot) => ot.employee_id === params.employee_id);
  }

  if (params?.status) {
    result = result.filter((ot) => ot.status === params.status);
  }

  // Sort by overtime_date descending
  result.sort(
    (a, b) =>
      new Date(b.overtime_date).getTime() - new Date(a.overtime_date).getTime(),
  );

  return result;
}

export function getDummyOvertimeRequestById(
  id: number,
): OvertimeRequest | null {
  return DUMMY_OVERTIME_REQUESTS.find((ot) => ot.id === id) ?? null;
}
