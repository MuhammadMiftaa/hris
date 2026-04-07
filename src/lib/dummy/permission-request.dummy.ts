import type {
  PermissionRequest,
  PermissionListParams,
} from "@/types/permission-request";

// ════════════════════════════════════════════
// PERMISSION REQUEST DUMMY DATA
// ════════════════════════════════════════════

const getDateString = (daysAgo: number): string => {
  const date = new Date("2026-04-07");
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getTimestamp = (dateStr: string, time: string): string => {
  return `${dateStr}T${time}:00Z`;
};

export const DUMMY_PERMISSION_REQUESTS: PermissionRequest[] = [
  // Pending - late_arrival
  {
    id: 1,
    employee_id: 3,
    employee_name: "Usman Hakim",
    permission_type: "late_arrival",
    date: getDateString(2),
    leave_time: null,
    return_time: "09:00",
    reason: "Ada janji dokter pagi hari, akan datang sekitar jam 9",
    document_url: null,
    status: "pending",
    approved_by: null,
    approver_name: undefined,
    approver_notes: null,
    created_at: getTimestamp(getDateString(3), "16:00"),
    updated_at: getTimestamp(getDateString(3), "16:00"),
    deleted_at: null,
  },
  // Approved - early_leave (half_day related - attendance id 7)
  {
    id: 2,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    permission_type: "early_leave",
    date: getDateString(6),
    leave_time: "12:00",
    return_time: null,
    reason: "Urusan keluarga mendesak, perlu pulang lebih awal",
    document_url: null,
    status: "approved",
    approved_by: 1,
    approver_name: "Ahmad Fauzan",
    approver_notes: "Disetujui, semoga keluarga baik-baik saja",
    created_at: getTimestamp(getDateString(7), "08:30"),
    updated_at: getTimestamp(getDateString(6), "10:00"),
    deleted_at: null,
  },
  // Approved - out_of_office
  {
    id: 3,
    employee_id: 4,
    employee_name: "Aisyah Rahmawati",
    permission_type: "out_of_office",
    date: getDateString(5),
    leave_time: "10:00",
    return_time: "12:00",
    reason: "Perlu ke bank untuk urusan administrasi pribadi",
    document_url: null,
    status: "approved",
    approved_by: 2,
    approver_name: "Fatimah Azzahra",
    approver_notes: "Disetujui",
    created_at: getTimestamp(getDateString(6), "09:00"),
    updated_at: getTimestamp(getDateString(5), "09:30"),
    deleted_at: null,
  },
  // Rejected - late_arrival
  {
    id: 4,
    employee_id: 5,
    employee_name: "Muhammad Rizki",
    permission_type: "late_arrival",
    date: getDateString(10),
    leave_time: null,
    return_time: "10:00",
    reason: "Ingin datang terlambat karena ada urusan pribadi",
    document_url: null,
    status: "rejected",
    approved_by: 2,
    approver_name: "Fatimah Azzahra",
    approver_notes:
      "Tidak disetujui, alasan kurang jelas. Mohon ajukan ulang dengan keterangan yang lebih detail.",
    created_at: getTimestamp(getDateString(11), "15:00"),
    updated_at: getTimestamp(getDateString(10), "08:00"),
    deleted_at: null,
  },
  // Pending - out_of_office
  {
    id: 5,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    permission_type: "out_of_office",
    date: getDateString(0), // hari ini
    leave_time: "14:00",
    return_time: "16:00",
    reason: "Meeting dengan vendor di luar kantor",
    document_url: null,
    status: "pending",
    approved_by: null,
    approver_name: undefined,
    approver_notes: null,
    created_at: getTimestamp(getDateString(1), "17:00"),
    updated_at: getTimestamp(getDateString(1), "17:00"),
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// GETTER FUNCTIONS
// ════════════════════════════════════════════

export function getDummyPermissionRequests(
  params?: PermissionListParams,
): PermissionRequest[] {
  let result = [...DUMMY_PERMISSION_REQUESTS];

  if (params?.employee_id) {
    result = result.filter((req) => req.employee_id === params.employee_id);
  }

  if (params?.status) {
    result = result.filter((req) => req.status === params.status);
  }

  if (params?.permission_type) {
    result = result.filter(
      (req) => req.permission_type === params.permission_type,
    );
  }

  // Sort by date descending (newest first)
  result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return result;
}

export function getDummyPermissionRequestById(
  id: number,
): PermissionRequest | null {
  return DUMMY_PERMISSION_REQUESTS.find((req) => req.id === id) ?? null;
}
