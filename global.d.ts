declare interface Attendance {}

declare interface AttendanceSummary {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  onTimeCount: number;
  lateCount: number;
  halfDayCount: number;
  fullDayCount: number;
  type: string;
}
