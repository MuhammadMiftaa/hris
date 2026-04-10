import type { DailyReport, DailyReportListParams } from "@/types/daily-report";

// ════════════════════════════════════════════
// DAILY REPORT DUMMY DATA (v3 — refactored)
// ════════════════════════════════════════════

const getDateString = (daysAgo: number): string => {
  const date = new Date("2026-04-07");
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getTimestamp = (dateStr: string, time: string): string => {
  return `${dateStr}T${time}:00Z`;
};

export const DUMMY_DAILY_REPORTS: DailyReport[] = [
  // Hari ini — belum diisi (auto-generated, belum submit)
  {
    id: 1,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    attendance_log_id: 1,
    report_date: getDateString(0),
    activities: null,
    is_submitted: false,
    submitted_at: null,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "00:00"),
    deleted_at: null,
  },
  // Kemarin — submitted
  {
    id: 2,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    attendance_log_id: 2,
    report_date: getDateString(1),
    activities: `1. Review dan approval pengajuan cuti karyawan (5 pengajuan)
2. Koordinasi dengan tim IT terkait sistem absensi
3. Meeting dengan vendor catering untuk kontrak baru
4. Update data karyawan baru di sistem HRIS`,
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(1), "17:15"),
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(1), "00:00"),
    updated_at: getTimestamp(getDateString(1), "17:15"),
    deleted_at: null,
  },
  // 2 hari lalu — submitted
  {
    id: 3,
    employee_id: 3,
    employee_name: "Usman Hakim",
    attendance_log_id: 3,
    report_date: getDateString(2),
    activities: `1. Mengajar kelas Matematika kelas 10A (2 jam)
2. Mengajar kelas Matematika kelas 10B (2 jam)
3. Koreksi tugas siswa
4. Rapat koordinasi guru bidang studi`,
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(2), "16:45"),
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(2), "00:00"),
    updated_at: getTimestamp(getDateString(2), "16:45"),
    deleted_at: null,
  },
  // 3 hari lalu — submitted
  {
    id: 4,
    employee_id: 4,
    employee_name: "Aisyah Rahmawati",
    attendance_log_id: 4,
    report_date: getDateString(3),
    activities: `1. Input data absensi karyawan ke sistem
2. Filing dokumen kontrak kerja
3. Membantu proses onboarding karyawan baru
4. Koordinasi dengan tim IT untuk troubleshooting printer`,
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(3), "17:00"),
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(3), "00:00"),
    updated_at: getTimestamp(getDateString(3), "17:00"),
    deleted_at: null,
  },
  // 4 hari lalu — submitted
  {
    id: 5,
    employee_id: 5,
    employee_name: "Muhammad Rizki",
    attendance_log_id: 5,
    report_date: getDateString(4),
    activities: `1. Maintenance server cabang
2. Update software di komputer lab
3. Troubleshooting jaringan di lantai 2
4. Dokumentasi inventory perangkat IT`,
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(4), "17:30"),
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(4), "00:00"),
    updated_at: getTimestamp(getDateString(4), "17:30"),
    deleted_at: null,
  },
  // 5 hari lalu — submitted
  {
    id: 6,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    attendance_log_id: 6,
    report_date: getDateString(5),
    activities: `1. Review proposal anggaran Q2
2. Meeting dengan board of directors
3. Finalisasi kontrak kerjasama dengan vendor baru
4. Koordinasi dengan manager departemen terkait target semester`,
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(5), "18:00"),
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(5), "00:00"),
    updated_at: getTimestamp(getDateString(5), "18:00"),
    deleted_at: null,
  },
  // 6 hari lalu — missing (auto-generated, tidak diisi)
  {
    id: 7,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    attendance_log_id: 7,
    report_date: getDateString(6),
    activities: null,
    is_submitted: false,
    submitted_at: null,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(6), "00:00"),
    updated_at: getTimestamp(getDateString(6), "00:00"),
    deleted_at: null,
  },
  // 7 hari lalu — submitted
  {
    id: 8,
    employee_id: 3,
    employee_name: "Usman Hakim",
    attendance_log_id: 8,
    report_date: getDateString(7),
    activities: `1. Mengajar kelas Matematika kelas 11A (2 jam)
2. Mengajar kelas Matematika kelas 11B (2 jam)
3. Persiapan materi ujian tengah semester
4. Konsultasi akademik dengan siswa`,
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(7), "17:00"),
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(7), "00:00"),
    updated_at: getTimestamp(getDateString(7), "17:00"),
    deleted_at: null,
  },
  // 10 hari lalu — submitted
  {
    id: 9,
    employee_id: 5,
    employee_name: "Muhammad Rizki",
    attendance_log_id: 11,
    report_date: getDateString(10),
    activities: `1. Setup workstation untuk karyawan baru
2. Backup data server mingguan
3. Update antivirus di semua komputer
4. Monitoring performa jaringan`,
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(10), "17:00"),
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(10), "00:00"),
    updated_at: getTimestamp(getDateString(10), "17:00"),
    deleted_at: null,
  },
  // 12 hari lalu — missing
  {
    id: 10,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    attendance_log_id: 13,
    report_date: getDateString(12),
    activities: null,
    is_submitted: false,
    submitted_at: null,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(12), "00:00"),
    updated_at: getTimestamp(getDateString(12), "00:00"),
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// GETTER FUNCTIONS
// ════════════════════════════════════════════

export function getDummyDailyReports(
  params?: DailyReportListParams,
): DailyReport[] {
  let result = [...DUMMY_DAILY_REPORTS];

  if (params?.employee_id) {
    result = result.filter(
      (report) => report.employee_id === params.employee_id,
    );
  }

  if (params?.is_submitted !== undefined) {
    result = result.filter(
      (report) => report.is_submitted === params.is_submitted,
    );
  }

  if (params?.start_date) {
    result = result.filter(
      (report) => report.report_date >= params.start_date!,
    );
  }

  if (params?.end_date) {
    result = result.filter((report) => report.report_date <= params.end_date!);
  }

  // Sort by report_date descending
  result.sort(
    (a, b) =>
      new Date(b.report_date).getTime() - new Date(a.report_date).getTime(),
  );

  return result;
}

export function getDummyDailyReportById(id: number): DailyReport | null {
  return DUMMY_DAILY_REPORTS.find((report) => report.id === id) ?? null;
}
