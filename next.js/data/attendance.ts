import type { AttendanceRecord, ShiftInfo } from './types';

export const currentShift: ShiftInfo = {
  id: 'shift-001',
  name: 'General Shift',
  startTime: '09:00',
  endTime: '18:00',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
};

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-001', employeeId: 'emp-001', date: '2026-06-23',
    clockIn: '09:02', clockOut: '18:15', status: 'present',
    productiveHours: 8.5, breakHours: 0.72, overtimeHours: 0.25,
    totalHours: 9.22, clockMethod: 'selfie', locationVerified: true,
    ipValidated: true, shiftName: 'General Shift',
  },
  {
    id: 'att-002', employeeId: 'emp-001', date: '2026-06-22',
    clockIn: '09:30', clockOut: '18:00', status: 'late',
    productiveHours: 7.5, breakHours: 1.0, overtimeHours: 0,
    totalHours: 8.5, clockMethod: 'selfie', locationVerified: true,
    ipValidated: true, shiftName: 'General Shift', exceptionFlag: 'Late arrival',
  },
  {
    id: 'att-003', employeeId: 'emp-001', date: '2026-06-21',
    clockIn: '08:58', clockOut: '18:02', status: 'present',
    productiveHours: 8.5, breakHours: 0.6, overtimeHours: 0,
    totalHours: 9.07, clockMethod: 'selfie', locationVerified: true,
    ipValidated: true, shiftName: 'General Shift',
  },
  {
    id: 'att-004', employeeId: 'emp-001', date: '2026-06-20',
    status: 'on-leave', productiveHours: 0, breakHours: 0, overtimeHours: 0,
    totalHours: 0, clockMethod: 'manual', locationVerified: false,
    ipValidated: false, shiftName: 'General Shift',
  },
  {
    id: 'att-005', employeeId: 'emp-001', date: '2026-06-19',
    clockIn: '09:05', clockOut: '14:00', status: 'half-day',
    productiveHours: 4.5, breakHours: 0.3, overtimeHours: 0,
    totalHours: 4.92, clockMethod: 'selfie', locationVerified: true,
    ipValidated: true, shiftName: 'General Shift', exceptionFlag: 'Half day',
  },
  {
    id: 'att-006', employeeId: 'emp-001', date: '2026-06-18',
    status: 'absent', productiveHours: 0, breakHours: 0, overtimeHours: 0,
    totalHours: 0, clockMethod: 'manual', locationVerified: false,
    ipValidated: false, shiftName: 'General Shift', exceptionFlag: 'Unplanned absence',
  },
  {
    id: 'att-007', employeeId: 'emp-001', date: '2026-06-17',
    clockIn: '09:00', clockOut: '20:30', status: 'present',
    productiveHours: 10, breakHours: 1, overtimeHours: 2.5,
    totalHours: 11.5, clockMethod: 'selfie', locationVerified: true,
    ipValidated: true, shiftName: 'General Shift',
  },
  {
    id: 'att-008', employeeId: 'emp-001', date: '2026-06-16',
    status: 'holiday', productiveHours: 0, breakHours: 0, overtimeHours: 0,
    totalHours: 0, clockMethod: 'manual', locationVerified: false,
    ipValidated: false, shiftName: 'General Shift',
  },
];

// Monthly attendance summary
export const attendanceSummary = {
  present: 18,
  absent: 1,
  late: 2,
  halfDay: 1,
  onLeave: 3,
  holidays: 2,
  workingDays: 22,
  attendancePercent: 86,
};

// Weekly hours for chart (last 7 days)
export const weeklyHours = [
  { day: 'Mon', hours: 9.22, overtime: 0.25 },
  { day: 'Tue', hours: 8.5, overtime: 0 },
  { day: 'Wed', hours: 9.07, overtime: 0 },
  { day: 'Thu', hours: 0, overtime: 0 },
  { day: 'Fri', hours: 4.92, overtime: 0 },
  { day: 'Sat', hours: 0, overtime: 0 },
  { day: 'Sun', hours: 11.5, overtime: 2.5 },
];
