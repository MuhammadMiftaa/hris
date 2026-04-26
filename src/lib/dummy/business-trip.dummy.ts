import type {
  BusinessTripRequest,
  BusinessTripListParams,
} from "@/types/business-trip";

// ════════════════════════════════════════════
// BUSINESS TRIP REQUEST DUMMY DATA
// ════════════════════════════════════════════

const getDateString = (daysAgo: number): string => {
  const date = new Date("2026-04-07");
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getTimestamp = (dateStr: string, time: string): string => {
  return `${dateStr}T${time}:00Z`;
};

export const DUMMY_BUSINESS_TRIPS: BusinessTripRequest[] = [
  // Approved - linked to attendance_logs id 12
  {
    id: 1,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    destination: "Jakarta",
    start_date: getDateString(11),
    end_date: getDateString(11),
    total_days: 1,
    purpose: "Meeting dengan klien PT. ABC untuk pembahasan kontrak kerjasama",
    document_url: "1/1714100000_surat_tugas_ahmad.pdf",
    status: "approved",
    approved_by: 2,
    approver_name: "Fatimah Azzahra",
    approver_notes: "Disetujui, mohon siapkan laporan perjalanan",
    created_at: getTimestamp(getDateString(14), "10:00"),
    updated_at: getTimestamp(getDateString(12), "09:00"),
    deleted_at: null,
  },
  // Pending
  {
    id: 2,
    employee_id: 3,
    employee_name: "Usman Hakim",
    destination: "Bandung",
    start_date: getDateString(-3), // 3 hari ke depan
    end_date: getDateString(-5),
    total_days: 3,
    purpose:
      "Training dan workshop pengembangan kurikulum di partner institution",
    document_url: null,
    status: "pending",
    approved_by: null,
    approver_name: undefined,
    approver_notes: null,
    created_at: getTimestamp(getDateString(2), "11:00"),
    updated_at: getTimestamp(getDateString(2), "11:00"),
    deleted_at: null,
  },
  // Rejected
  {
    id: 3,
    employee_id: 5,
    employee_name: "Muhammad Rizki",
    destination: "Yogyakarta",
    start_date: getDateString(20),
    end_date: getDateString(18),
    total_days: 3,
    purpose: "Kunjungan ke cabang Yogyakarta untuk audit internal",
    document_url: null,
    status: "rejected",
    approved_by: 2,
    approver_name: "Fatimah Azzahra",
    approver_notes:
      "Tidak disetujui, jadwal bentrok dengan kegiatan kantor. Silakan reschedule.",
    created_at: getTimestamp(getDateString(25), "09:00"),
    updated_at: getTimestamp(getDateString(22), "14:00"),
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// GETTER FUNCTIONS
// ════════════════════════════════════════════

export function getDummyBusinessTrips(
  params?: BusinessTripListParams,
): BusinessTripRequest[] {
  let result = [...DUMMY_BUSINESS_TRIPS];

  if (params?.employee_id) {
    result = result.filter((trip) => trip.employee_id === params.employee_id);
  }

  if (params?.status) {
    result = result.filter((trip) => trip.status === params.status);
  }

  // Sort by start_date descending
  result.sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
  );

  return result;
}

export function getDummyBusinessTripById(
  id: number,
): BusinessTripRequest | null {
  return DUMMY_BUSINESS_TRIPS.find((trip) => trip.id === id) ?? null;
}
