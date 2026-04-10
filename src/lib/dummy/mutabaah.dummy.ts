import type {
  MutabaahLog,
  MutabaahListParams,
  MutabaahTodayStatus,
  MutabaahDailyReport,
  MutabaahMonthlySummary,
  MutabaahCategorySummary,
} from "@/types/mutabaah";

// ══════════════════════════════════════════════════════════════════════════════
// MUTABA'AH DUMMY DATA (§14)
// ══════════════════════════════════════════════════════════════════════════════

const getDateString = (daysAgo: number): string => {
  const date = new Date("2026-04-07");
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getTimestamp = (dateStr: string, time: string): string => {
  return `${dateStr}T${time}:00Z`;
};

export const DUMMY_MUTABAAH_LOGS: MutabaahLog[] = [
  // Hari ini — 7 submitted, 3 belum
  {
    id: 1,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    attendance_log_id: 1,
    log_date: getDateString(0),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(0), "07:55"),
    target_pages: 5,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "07:55"),
    deleted_at: null,
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    attendance_log_id: 2,
    log_date: getDateString(0),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(0), "08:10"),
    target_pages: 5,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "08:10"),
    deleted_at: null,
  },
  {
    id: 3,
    employee_id: 3,
    employee_name: "Usman Hakim",
    attendance_log_id: 3,
    log_date: getDateString(0),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(0), "07:30"),
    target_pages: 10, // trainer
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "07:30"),
    deleted_at: null,
  },
  {
    id: 4,
    employee_id: 4,
    employee_name: "Aisyah Rahmawati",
    attendance_log_id: 4,
    log_date: getDateString(0),
    is_submitted: false,
    submitted_at: null,
    target_pages: 5,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "00:00"),
    deleted_at: null,
  },
  {
    id: 5,
    employee_id: 5,
    employee_name: "Muhammad Rizki",
    attendance_log_id: 5,
    log_date: getDateString(0),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(0), "08:45"),
    target_pages: 10, // trainer
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "08:45"),
    deleted_at: null,
  },
  {
    id: 6,
    employee_id: 6,
    employee_name: "Khadijah Sari",
    attendance_log_id: 6,
    log_date: getDateString(0),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(0), "07:45"),
    target_pages: 5,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "07:45"),
    deleted_at: null,
  },
  {
    id: 7,
    employee_id: 7,
    employee_name: "Ali Syahputra",
    attendance_log_id: 7,
    log_date: getDateString(0),
    is_submitted: false,
    submitted_at: null,
    target_pages: 10, // trainer
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "00:00"),
    deleted_at: null,
  },
  {
    id: 8,
    employee_id: 8,
    employee_name: "Zahra Putri",
    attendance_log_id: 8,
    log_date: getDateString(0),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(0), "09:00"),
    target_pages: 5,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "09:00"),
    deleted_at: null,
  },
  {
    id: 9,
    employee_id: 9,
    employee_name: "Ibrahim Maulana",
    attendance_log_id: 9,
    log_date: getDateString(0),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(0), "08:20"),
    target_pages: 5,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "08:20"),
    deleted_at: null,
  },
  {
    id: 10,
    employee_id: 10,
    employee_name: "Nurul Hidayah",
    attendance_log_id: 10,
    log_date: getDateString(0),
    is_submitted: false,
    submitted_at: null,
    target_pages: 5,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(0), "00:00"),
    updated_at: getTimestamp(getDateString(0), "00:00"),
    deleted_at: null,
  },

  // Kemarin — semua submitted
  {
    id: 11,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    attendance_log_id: 11,
    log_date: getDateString(1),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(1), "08:00"),
    target_pages: 5,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(1), "00:00"),
    updated_at: getTimestamp(getDateString(1), "08:00"),
    deleted_at: null,
  },
  {
    id: 12,
    employee_id: 3,
    employee_name: "Usman Hakim",
    attendance_log_id: 13,
    log_date: getDateString(1),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(1), "07:40"),
    target_pages: 10,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(1), "00:00"),
    updated_at: getTimestamp(getDateString(1), "07:40"),
    deleted_at: null,
  },
  {
    id: 13,
    employee_id: 5,
    employee_name: "Muhammad Rizki",
    attendance_log_id: 15,
    log_date: getDateString(1),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(1), "08:30"),
    target_pages: 10,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(1), "00:00"),
    updated_at: getTimestamp(getDateString(1), "08:30"),
    deleted_at: null,
  },

  // 2 hari lalu — 1 missing
  {
    id: 14,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    attendance_log_id: 17,
    log_date: getDateString(2),
    is_submitted: false,
    submitted_at: null,
    target_pages: 5,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(2), "00:00"),
    updated_at: getTimestamp(getDateString(2), "00:00"),
    deleted_at: null,
  },
  {
    id: 15,
    employee_id: 7,
    employee_name: "Ali Syahputra",
    attendance_log_id: 19,
    log_date: getDateString(2),
    is_submitted: true,
    submitted_at: getTimestamp(getDateString(2), "07:50"),
    target_pages: 10,
    is_auto_generated: true,
    created_at: getTimestamp(getDateString(2), "00:00"),
    updated_at: getTimestamp(getDateString(2), "07:50"),
    deleted_at: null,
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// GETTER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

export function getDummyMutabaahLogs(
  params?: MutabaahListParams,
): MutabaahLog[] {
  let result = [...DUMMY_MUTABAAH_LOGS];

  if (params?.employee_id) {
    result = result.filter((log) => log.employee_id === params.employee_id);
  }

  if (params?.is_submitted !== undefined) {
    result = result.filter((log) => log.is_submitted === params.is_submitted);
  }

  if (params?.start_date) {
    result = result.filter((log) => log.log_date >= params.start_date!);
  }

  if (params?.end_date) {
    result = result.filter((log) => log.log_date <= params.end_date!);
  }

  result.sort(
    (a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime(),
  );

  return result;
}

export function getDummyMutabaahTodayStatus(): MutabaahTodayStatus {
  return {
    has_record: true,
    is_submitted: false,
    submitted_at: null,
    target_pages: 5,
  };
}

export function getDummyMutabaahDailyReport(): MutabaahDailyReport[] {
  return [
    {
      employee_id: 1,
      employee_name: "Ahmad Fauzan",
      employee_number: "EMP-001",
      department_name: "Human Resource & General Affair",
      is_trainer: false,
      target_pages: 5,
      is_submitted: true,
      submitted_at: getTimestamp(getDateString(0), "07:55"),
    },
    {
      employee_id: 2,
      employee_name: "Fatimah Azzahra",
      employee_number: "EMP-002",
      department_name: "Human Resource & General Affair",
      is_trainer: false,
      target_pages: 5,
      is_submitted: true,
      submitted_at: getTimestamp(getDateString(0), "08:10"),
    },
    {
      employee_id: 3,
      employee_name: "Usman Hakim",
      employee_number: "EMP-003",
      department_name: "Akademik",
      is_trainer: true,
      target_pages: 10,
      is_submitted: true,
      submitted_at: getTimestamp(getDateString(0), "07:30"),
    },
    {
      employee_id: 4,
      employee_name: "Aisyah Rahmawati",
      employee_number: "EMP-004",
      department_name: "Human Resource & General Affair",
      is_trainer: false,
      target_pages: 5,
      is_submitted: false,
      submitted_at: null,
    },
    {
      employee_id: 5,
      employee_name: "Muhammad Rizki",
      employee_number: "EMP-005",
      department_name: "Akademik",
      is_trainer: true,
      target_pages: 10,
      is_submitted: true,
      submitted_at: getTimestamp(getDateString(0), "08:45"),
    },
    {
      employee_id: 6,
      employee_name: "Khadijah Sari",
      employee_number: "EMP-006",
      department_name: "Pendidikan & Kurikulum",
      is_trainer: false,
      target_pages: 5,
      is_submitted: true,
      submitted_at: getTimestamp(getDateString(0), "07:45"),
    },
    {
      employee_id: 7,
      employee_name: "Ali Syahputra",
      employee_number: "EMP-007",
      department_name: "Pendidikan & Kurikulum",
      is_trainer: true,
      target_pages: 10,
      is_submitted: false,
      submitted_at: null,
    },
    {
      employee_id: 8,
      employee_name: "Zahra Putri",
      employee_number: "EMP-008",
      department_name: "Human Resource & General Affair",
      is_trainer: false,
      target_pages: 5,
      is_submitted: true,
      submitted_at: getTimestamp(getDateString(0), "09:00"),
    },
    {
      employee_id: 9,
      employee_name: "Ibrahim Maulana",
      employee_number: "EMP-009",
      department_name: "Human Resource & General Affair",
      is_trainer: false,
      target_pages: 5,
      is_submitted: true,
      submitted_at: getTimestamp(getDateString(0), "08:20"),
    },
    {
      employee_id: 10,
      employee_name: "Nurul Hidayah",
      employee_number: "EMP-010",
      department_name: "Akademik",
      is_trainer: false,
      target_pages: 5,
      is_submitted: false,
      submitted_at: null,
    },
  ];
}

export function getDummyMutabaahMonthlySummary(): MutabaahMonthlySummary[] {
  return [
    {
      employee_id: 1,
      employee_name: "Ahmad Fauzan",
      is_trainer: false,
      total_working_days: 22,
      total_submitted: 20,
      compliance_percentage: 90.9,
    },
    {
      employee_id: 2,
      employee_name: "Fatimah Azzahra",
      is_trainer: false,
      total_working_days: 22,
      total_submitted: 18,
      compliance_percentage: 81.8,
    },
    {
      employee_id: 3,
      employee_name: "Usman Hakim",
      is_trainer: true,
      total_working_days: 22,
      total_submitted: 22,
      compliance_percentage: 100,
    },
    {
      employee_id: 4,
      employee_name: "Aisyah Rahmawati",
      is_trainer: false,
      total_working_days: 22,
      total_submitted: 19,
      compliance_percentage: 86.4,
    },
    {
      employee_id: 5,
      employee_name: "Muhammad Rizki",
      is_trainer: true,
      total_working_days: 22,
      total_submitted: 21,
      compliance_percentage: 95.5,
    },
    {
      employee_id: 7,
      employee_name: "Ali Syahputra",
      is_trainer: true,
      total_working_days: 22,
      total_submitted: 20,
      compliance_percentage: 90.9,
    },
  ];
}

export function getDummyMutabaahCategorySummary(): MutabaahCategorySummary[] {
  return [
    {
      category: "non_trainer",
      total_employees: 7,
      total_submitted_today: 5,
      total_not_submitted_today: 2,
      average_compliance: 87.0,
    },
    {
      category: "trainer",
      total_employees: 3,
      total_submitted_today: 2,
      total_not_submitted_today: 1,
      average_compliance: 95.5,
    },
  ];
}
