using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace AttendanceFeature.Domain
{
    public class AttendanceRecord : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string? ClockIn { get; set; }
        public string? ClockOut { get; set; }
        public string Status { get; set; } = "present";
        public double ProductiveHours { get; set; }
        public double BreakHours { get; set; }
        public double OvertimeHours { get; set; }
        public double TotalHours { get; set; }
        public string ClockMethod { get; set; } = "selfie";
        public bool LocationVerified { get; set; }
        public bool IpValidated { get; set; }
        public string ShiftName { get; set; } = "General Shift";
        public string? ExceptionFlag { get; set; }
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
