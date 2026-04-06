Table branches {
  id              INTEGER [PRIMARY KEY]
  code            VARCHAR(20) [UNIQUE, NOT NULL]
  name            VARCHAR(100) [NOT NULL]
  address         TEXT
  latitude        DECIMAL(10,8)
  longitude       DECIMAL(11,8)
  radius_meters   INTEGER [DEFAULT: 100]
  allow_wfh       BOOLEAN [DEFAULT: FALSE]
  created_at      TIMESTAMP [DEFAULT: `NOW()`]
  updated_at      TIMESTAMP
  deleted_at      TIMESTAMP [NULL]
}

Table employees {
  id                  INTEGER [PRIMARY KEY]
  employee_number     VARCHAR(20) [UNIQUE, NOT NULL]
  full_name           VARCHAR(150) [NOT NULL]
  nik                 VARCHAR(16) [UNIQUE]
  npwp                VARCHAR(20) [UNIQUE]
  kk_number           VARCHAR(16)
  birth_date          DATE [NOT NULL]
  birth_place         VARCHAR(100)
  gender              ENUM('male','female','other')
  religion            VARCHAR(50)
  marital_status      ENUM('single','married','widowed','divorced')
  blood_type          VARCHAR(5)
  nationality         VARCHAR(50)
  height              NUMERIC(5,2)
  weight              NUMERIC(5,2)
  photo_url           TEXT
  is_active           BOOLEAN [DEFAULT: TRUE]
  branch_id           INTEGER [REF: > branches.id]
  department_id       INTEGER [REF: > departments.id]
  role_id             INTEGER [REF: > roles.id]
  job_positions_id    INTEGER [REF: > job_positions.id]
  created_at          TIMESTAMP [DEFAULT: `NOW()`]
  updated_at          TIMESTAMP
  deleted_at          TIMESTAMP [NULL]
}

Table roles {
  id          INTEGER [PRIMARY KEY]
  name        VARCHAR(100) [NOT NULL]
  description TEXT
  created_at  TIMESTAMP [DEFAULT: `NOW()`]
  updated_at  TIMESTAMP
  deleted_at  TIMESTAMP [NULL]
}

Table permissions {
  id          INTEGER [PRIMARY KEY]
  module      VARCHAR(100) [NOT NULL]
  action      VARCHAR(100) [NOT NULL]
  description TEXT
  created_at  TIMESTAMP [DEFAULT: `NOW()`]
  updated_at  TIMESTAMP
  deleted_at  TIMESTAMP [NULL]
}

Table role_permissions {
  id            INTEGER [PRIMARY KEY]
  role_id       INTEGER [REF: > roles.id]
  permission_id INTEGER [REF: > permissions.id]
  created_at    TIMESTAMP [DEFAULT: `NOW()`]
}

Table employee_contacts {
  id              INTEGER [PRIMARY KEY]
  employee_id     INTEGER [REF: > employees.id]
  phone           VARCHAR(20)
  email           VARCHAR(150)
  address_line    TEXT
  city            VARCHAR(50)
  province        VARCHAR(50)
  postal_code     VARCHAR(10)
  is_primary      BOOLEAN [DEFAULT: FALSE]
  created_at      TIMESTAMP [DEFAULT: `NOW()`]
  updated_at      TIMESTAMP
  deleted_at      TIMESTAMP [NULL]
}

Table departments {
  id              INTEGER [PRIMARY KEY]
  code            VARCHAR(20) [UNIQUE, NOT NULL]
  name            VARCHAR(100) [NOT NULL]
  branch_id       INTEGER [REF: > branches.id, NULL]  -- NULL = berlaku untuk semua cabang
  description     TEXT
  is_active       BOOLEAN [DEFAULT: TRUE]
  created_at      TIMESTAMP [DEFAULT: `NOW()`]
  updated_at      TIMESTAMP
  deleted_at      TIMESTAMP [NULL]
}

Table job_positions {
  id              INTEGER [PRIMARY KEY]
  title           VARCHAR(100)
  department_id   INTEGER [REF: > departments.id]
  created_at      TIMESTAMP [DEFAULT: `NOW()`]
  updated_at      TIMESTAMP
  deleted_at      TIMESTAMP [NULL]
}

Table employment_contracts {
  id              INTEGER [PRIMARY KEY]
  employee_id     INTEGER [REF: > employees.id]
  contract_type   ENUM('pkwt','pkwtt','probation','intern','part_time','freelance')
  start_date      DATE
  end_date        DATE
  salary          NUMERIC(12,2)
  created_at      TIMESTAMP [DEFAULT: `NOW()`]
  updated_at      TIMESTAMP
  deleted_at      TIMESTAMP [NULL]
}

Table shift_templates {
  id                      INTEGER [PRIMARY KEY]
  name                    VARCHAR(100) [NOT NULL]
  is_flexible             BOOLEAN [DEFAULT: FALSE]
  created_at              TIMESTAMP [DEFAULT: `NOW()`]
  updated_at              TIMESTAMP
  deleted_at              TIMESTAMP [NULL]
}

Table shift_template_details {
  id                  INTEGER [PRIMARY KEY]
  shift_template_id   INTEGER [REF: > shift_templates.id]
  day_of_week         ENUM('monday','tuesday','wednesday', 'thursday','friday','saturday','sunday')
  is_working_day      BOOLEAN [DEFAULT: TRUE]
  clock_in_start      TIME
  clock_in_end        TIME
  break_dhuhr_start   TIME
  break_dhuhr_end     TIME
  break_asr_start     TIME
  break_asr_end       TIME
  clock_out_start     TIME
  clock_out_end       TIME
  created_at          TIMESTAMP [DEFAULT: `NOW()`]
  updated_at          TIMESTAMP
  deleted_at          TIMESTAMP [NULL]
}

Table employee_schedules {
  id                  INTEGER [PRIMARY KEY]
  employee_id         INTEGER [REF: > employees.id]
  shift_template_id   INTEGER [REF: > shift_templates.id]
  effective_date      DATE [NOT NULL]
  end_date            DATE    -- Jika NULL maka berlaku seterusnya
  is_active           BOOLEAN [DEFAULT: TRUE]
  created_at          TIMESTAMP [DEFAULT: `NOW()`]
  updated_at          TIMESTAMP
  deleted_at          TIMESTAMP [NULL]
}

-- Otomatis absent jika sudah 23:59 tidak ada presensi
Table attendance_logs {
  id                        INTEGER [PRIMARY KEY]
  employee_id               INTEGER [REF: > employees.id]
  schedule_id               INTEGER [REF: > employee_schedules.id]
  attendance_date           DATE [NOT NULL]
  clock_in_at               TIMESTAMP
  clock_out_at              TIMESTAMP
  clock_in_lat              DECIMAL(10,8)
  clock_in_lng              DECIMAL(11,8)
  clock_out_lat             DECIMAL(10,8)
  clock_out_lng             DECIMAL(11,8)
  clock_in_photo_url        TEXT
  clock_out_photo_url       TEXT
  clock_in_method           ENUM('gps','qr_code','face_recognition','manual')
  clock_out_method          ENUM('gps','qr_code','face_recognition','manual')
  status                    ENUM('present','late','absent','half_day','leave','business_trip','holiday')
  permission_request_id     INTEGER [REF: > permission_requests.id, NULL]
  leave_request_id          INTEGER [REF: > leave_requests.id, NULL]
  business_trip_request_id  INTEGER [REF: > business_trip_requests.id, NULL]
  is_counted_as_full_day    BOOLEAN [DEFAULT: FALSE]
  late_minutes              INTEGER [DEFAULT: 0]
  early_leave_minutes       INTEGER [DEFAULT: 0]
  late_notes                TEXT
  early_leave_notes         TEXT
  late_document_url         TEXT
  overtime_minutes          INTEGER [DEFAULT: 0]
  is_auto_generated         BOOLEAN [DEFAULT: FALSE]
  created_at                TIMESTAMP [DEFAULT: `NOW()`]
  updated_at                TIMESTAMP
  deleted_at                TIMESTAMP [NULL]
}

-- Jika lupa presensi, bisa langsung presensi dan bisa dilanjut pengajuan atau langusung ajukan presensi
Table attendance_overrides {
  id                    INTEGER [PRIMARY KEY]
  attendance_log_id     INTEGER [REF: > attendance_logs.id]
  requested_by          INTEGER [REF: > employees.id]
  approved_by           INTEGER [REF: > employees.id]
  override_type         ENUM('clock_in','clock_out','full_day')
  original_clock_in     TIMESTAMP
  original_clock_out    TIMESTAMP
  corrected_clock_in    TIMESTAMP
  corrected_clock_out   TIMESTAMP
  reason                TEXT [NOT NULL]
  status                ENUM('pending','approved','rejected')
  created_at            TIMESTAMP [DEFAULT: `NOW()`]
  updated_at            TIMESTAMP
  deleted_at            TIMESTAMP [NULL]
}

Table permission_requests {
  id               INTEGER [PRIMARY KEY]
  employee_id      INTEGER [REF: > employees.id]
  permission_type  ENUM('out_of_office','late_arrival','early_leave')
  date             DATE [NOT NULL]
  leave_time       TIME [NULL]   -- jam keluar / jam tiba untuk late_arrival
  return_time      TIME [NULL]   -- jam kembali / tidak dipakai untuk late_arrival
  reason           TEXT [NOT NULL]
  document_url     TEXT
  status           ENUM('pending','approved','rejected')
  approved_by      INTEGER [REF: > employees.id]
  approver_notes   TEXT
  created_at       TIMESTAMP [DEFAULT: `NOW()`]
  updated_at       TIMESTAMP
  deleted_at       TIMESTAMP [NULL]
}

-- leave_types diperluas untuk menampung semua jenis cuti termasuk sakit
-- dan cuti khusus (pernikahan, duka, dll)
Table leave_types {
  id                            INTEGER [PRIMARY KEY]
  name                          VARCHAR(100) [NOT NULL]
  category                      ENUM('annual','sick','special','other')
  requires_document             BOOLEAN [DEFAULT: FALSE]
  requires_document_type        VARCHAR(100)

  -- Constraint durasi per pengajuan
  max_duration_per_request      INTEGER [NULL]
  max_duration_unit             ENUM('days','hours') [NULL]

  -- Constraint frekuensi per tahun
  max_occurrences_per_year      INTEGER [NULL]

  -- Constraint total durasi per tahun
  max_total_duration_per_year   INTEGER [NULL]
  max_total_duration_unit       ENUM('days','hours') [NULL]

  created_at                    TIMESTAMP [DEFAULT: `NOW()`]
  updated_at                    TIMESTAMP
  deleted_at                    TIMESTAMP [NULL]
}

-- leave_balances disesuaikan untuk menampung tracking
-- frekuensi dan durasi secara independen
Table leave_balances {
  id                  INTEGER [PRIMARY KEY]
  employee_id         INTEGER [REF: > employees.id]
  leave_type_id       INTEGER [REF: > leave_types.id]
  year                INTEGER [NOT NULL]
  used_occurrences    INTEGER [DEFAULT: 0]   -- tracking jumlah pengajuan
  used_duration       INTEGER [DEFAULT: 0]   -- tracking total durasi
  created_at          TIMESTAMP [DEFAULT: `NOW()`]
  updated_at          TIMESTAMP
  deleted_at          TIMESTAMP [NULL]
}

-- leave_requests sekarang menangani semua jenis tidak masuk:
-- cuti tahunan, sakit, cuti khusus (pernikahan, duka, dll)
Table leave_requests {
  id                  INTEGER [PRIMARY KEY]
  employee_id         INTEGER [REF: > employees.id]
  leave_type_id       INTEGER [REF: > leave_types.id]
  start_date          DATE [NOT NULL]
  end_date            DATE [NOT NULL]
  total_days          INTEGER [NOT NULL]
  total_hours         INTEGER [NULL]         -- untuk izin satuan jam (No 8)
  reason              TEXT
  document_url        TEXT
  status              ENUM('pending','approved_leader','approved_hr','rejected')
  created_at          TIMESTAMP [DEFAULT: `NOW()`]
  updated_at          TIMESTAMP
  deleted_at          TIMESTAMP [NULL]
}

Table leave_request_approvals {
  id               INTEGER [PRIMARY KEY]
  leave_request_id INTEGER [REF: > leave_requests.id]
  approver_id      INTEGER [REF: > employees.id]
  level            INTEGER [NOT NULL]  -- 1 = Leader Dept, 2 = Leader HRGA
  status           ENUM('pending','approved','rejected')
  notes            TEXT
  decided_at       TIMESTAMP
  created_at       TIMESTAMP [DEFAULT: `NOW()`]
}


Table business_trip_requests {
  id              INTEGER [PRIMARY KEY]
  employee_id     INTEGER [REF: > employees.id]
  destination     VARCHAR(255) [NOT NULL]
  start_date      DATE [NOT NULL]
  end_date        DATE [NOT NULL]
  total_days      INTEGER [NOT NULL]
  purpose         TEXT [NOT NULL]
  document_url    TEXT
  status          ENUM('pending','approved','rejected')
  approved_by     INTEGER [REF: > employees.id]
  approver_notes  TEXT
  created_at      TIMESTAMP [DEFAULT: `NOW()`]
  updated_at      TIMESTAMP
  deleted_at      TIMESTAMP [NULL]
}

Table overtime_requests {
  id                  INTEGER [PRIMARY KEY]
  employee_id         INTEGER [REF: > employees.id]
  attendance_log_id   INTEGER [REF: > attendance_logs.id]
  overtime_date       DATE [NOT NULL]
  planned_start       TIMESTAMP
  planned_end         TIMESTAMP
  actual_start        TIMESTAMP
  actual_end          TIMESTAMP
  planned_minutes     INTEGER [NOT NULL]
  actual_minutes      INTEGER
  reason              TEXT [NOT NULL]
  work_location_type  ENUM('office','home','outside')
  status              ENUM('pending','approved','rejected')
  approved_by         INTEGER [REF: > employees.id]
  approver_notes      TEXT
  created_at          TIMESTAMP [DEFAULT: `NOW()`]
  updated_at          TIMESTAMP
  deleted_at          TIMESTAMP [NULL]
}

Table daily_reports {
  id                  INTEGER [PRIMARY KEY]
  employee_id         INTEGER [REF: > employees.id]
  report_date         DATE [NOT NULL]
  activities          TEXT [NOT NULL]
  status              ENUM('submitted','missing')
  submitted_at        TIMESTAMP
  attendance_log_id   INTEGER [REF: > attendance_logs.id, NULL]
  created_at          TIMESTAMP [DEFAULT: `NOW()`]
  updated_at          TIMESTAMP
  deleted_at          TIMESTAMP [NULL]
}

Table holidays {
  id              INTEGER [PRIMARY KEY]
  name            VARCHAR(100) [NOT NULL]
  year            INTEGER [NOT NULL]
  date            DATE [NOT NULL]
  type            ENUM('national', 'joint', 'observance','company') [NOT NULL]
  branch_id       INTEGER [REF: > branches.id, NULL]
  description     TEXT
  created_at      TIMESTAMP [DEFAULT: `NOW()`]
  updated_at      TIMESTAMP
  deleted_at      TIMESTAMP [NULL]
}

Table audit_logs {
  id            INTEGER [PRIMARY KEY]
  employee_id   INTEGER [REF: > employees.id, NULL]
  table_name    VARCHAR(100) [NOT NULL]
  record_id     INTEGER [NOT NULL]
  action        ENUM('create','update','delete') [NOT NULL]
  old_values    JSONB [NULL]
  new_values    JSONB [NULL]
  ip_address    VARCHAR(45)
  user_agent    TEXT
  created_at    TIMESTAMP [DEFAULT: `NOW()`]
}