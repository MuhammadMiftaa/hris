import type {
  ShiftTemplate,
  EmployeeSchedule,
  ScheduleListParams,
} from "@/types/shift";
import { DUMMY_EMPLOYEES } from "./employee.dummy";

// ════════════════════════════════════════════
// SHIFT TEMPLATE DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_SHIFT_TEMPLATES: ShiftTemplate[] = [
  {
    id: 1,
    name: "Shift Reguler",
    clock_in_start: "07:30",
    clock_in_end: "08:10",
    clock_out_start: "15:30",
    clock_out_end: "16:30",
    break_duration_minutes: 60,
    is_flexible: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    name: "Shift Fleksibel",
    clock_in_start: "07:00",
    clock_in_end: "09:00",
    clock_out_start: "15:00",
    clock_out_end: "18:00",
    break_duration_minutes: 60,
    is_flexible: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyShiftTemplates(): ShiftTemplate[] {
  return DUMMY_SHIFT_TEMPLATES;
}

export function getDummyShiftTemplateById(
  id: number,
): ShiftTemplate | undefined {
  return DUMMY_SHIFT_TEMPLATES.find((shift) => shift.id === id);
}

// ════════════════════════════════════════════
// EMPLOYEE SCHEDULE DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_EMPLOYEE_SCHEDULES: EmployeeSchedule[] = [
  {
    id: 1,
    employee_id: 1,
    employee_name: DUMMY_EMPLOYEES[0]?.full_name,
    employee_number: DUMMY_EMPLOYEES[0]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: DUMMY_EMPLOYEES[1]?.full_name,
    employee_number: DUMMY_EMPLOYEES[1]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    employee_id: 3,
    employee_name: DUMMY_EMPLOYEES[2]?.full_name,
    employee_number: DUMMY_EMPLOYEES[2]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    employee_id: 4,
    employee_name: DUMMY_EMPLOYEES[3]?.full_name,
    employee_number: DUMMY_EMPLOYEES[3]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    employee_id: 5,
    employee_name: DUMMY_EMPLOYEES[4]?.full_name,
    employee_number: DUMMY_EMPLOYEES[4]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2025-01-01",
    end_date: null,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 6,
    employee_id: 6,
    employee_name: DUMMY_EMPLOYEES[5]?.full_name,
    employee_number: DUMMY_EMPLOYEES[5]?.employee_number,
    shift_template_id: 2,
    shift_name: DUMMY_SHIFT_TEMPLATES[1]?.name,
    effective_date: "2023-08-01",
    end_date: null,
    is_active: true,
    created_at: "2023-08-01T00:00:00Z",
    updated_at: "2023-08-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 7,
    employee_id: 7,
    employee_name: DUMMY_EMPLOYEES[6]?.full_name,
    employee_number: DUMMY_EMPLOYEES[6]?.employee_number,
    shift_template_id: 2,
    shift_name: DUMMY_SHIFT_TEMPLATES[1]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 8,
    employee_id: 8,
    employee_name: DUMMY_EMPLOYEES[7]?.full_name,
    employee_number: DUMMY_EMPLOYEES[7]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyEmployeeSchedules(
  params?: ScheduleListParams,
): EmployeeSchedule[] {
  let result = [...DUMMY_EMPLOYEE_SCHEDULES];

  if (params?.employee_id !== undefined) {
    result = result.filter((s) => s.employee_id === params.employee_id);
  }

  if (params?.shift_template_id !== undefined) {
    result = result.filter(
      (s) => s.shift_template_id === params.shift_template_id,
    );
  }

  if (params?.is_active !== undefined) {
    result = result.filter((s) => s.is_active === params.is_active);
  }

  return result;
}

export function getDummyEmployeeScheduleById(
  id: number,
): EmployeeSchedule | undefined {
  return DUMMY_EMPLOYEE_SCHEDULES.find((schedule) => schedule.id === id);
}
