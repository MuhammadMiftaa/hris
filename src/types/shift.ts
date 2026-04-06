// ════════════════════════════════════════════
// SHIFT & SCHEDULE TYPES
// ════════════════════════════════════════════

export interface ShiftTemplate {
  id: number;
  name: string;
  clock_in_start: string; // "07:30" format HH:mm
  clock_in_end: string; // "08:10"
  clock_out_start: string; // "15:30"
  clock_out_end: string; // "16:30"
  break_duration_minutes: number;
  is_flexible: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateShiftPayload {
  name: string;
  clock_in_start: string;
  clock_in_end: string;
  clock_out_start: string;
  clock_out_end: string;
  break_duration_minutes?: number;
  is_flexible?: boolean;
}

export interface UpdateShiftPayload extends Partial<CreateShiftPayload> {}

export interface EmployeeSchedule {
  id: number;
  employee_id: number;
  employee_name?: string; // joined field
  employee_number?: string; // joined field
  shift_template_id: number;
  shift_name?: string; // joined field
  effective_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateSchedulePayload {
  employee_id: number;
  shift_template_id: number;
  effective_date: string;
  end_date?: string | null;
}

export interface UpdateSchedulePayload extends Partial<CreateSchedulePayload> {
  is_active?: boolean;
}

export interface ScheduleListParams {
  employee_id?: number;
  shift_template_id?: number;
  is_active?: boolean;
}
