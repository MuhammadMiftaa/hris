// ════════════════════════════════════════════
// MASTER DATA DUMMY EXPORTS
// ════════════════════════════════════════════

// Branch
export {
  DUMMY_BRANCHES,
  getDummyBranches,
  getDummyBranchById,
} from "./branch.dummy";

// Department
export {
  DUMMY_DEPARTMENTS,
  getDummyDepartments,
  getDummyDepartmentById,
} from "./department.dummy";

// Position
export {
  DUMMY_POSITIONS,
  getDummyPositions,
  getDummyPositionById,
} from "./position.dummy";

// Role & Permission
export {
  DUMMY_ROLES,
  DUMMY_PERMISSIONS,
  DUMMY_ROLE_PERMISSIONS,
  getDummyRoles,
  getDummyRoleById,
  getDummyPermissions,
  getDummyRolePermissions,
} from "./role.dummy";

// Contract
export {
  DUMMY_CONTRACTS,
  getDummyContracts,
  getDummyContractById,
  getDummyActiveContract,
} from "./contract.dummy";

// Employee
export {
  DUMMY_EMPLOYEES,
  DUMMY_EMPLOYEE_CONTACTS,
  getDummyEmployees,
  getDummyEmployeeById,
  getDummyEmployeeContacts,
  getDummyEmployeeContactById,
} from "./employee.dummy";

// Shift & Schedule
export {
  DUMMY_SHIFT_TEMPLATES,
  DUMMY_EMPLOYEE_SCHEDULES,
  getDummyShiftTemplates,
  getDummyShiftTemplateById,
  getDummyShiftDetailsByTemplateId,
  getDummyEmployeeSchedules,
  getDummyEmployeeScheduleById,
} from "./shift.dummy";

// Holiday
export {
  DUMMY_HOLIDAYS,
  getDummyHolidays,
  getDummyHolidayById,
} from "./holiday.dummy";

// Profile (Employee Profile for demo mode)
export {
  DUMMY_EMPLOYEE_PROFILE,
  DUMMY_PROFILE_CONTACTS,
  getDummyEmployeeProfile,
  getDummyProfileContacts,
} from "./profile.dummy";
