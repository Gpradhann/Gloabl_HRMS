using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace LeaveFeature.Domain
{
    public class LeaveRequest : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeInitials { get; set; } = string.Empty;
        public string LeaveType { get; set; } = "casual";
        public string StartDate { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public int TotalDays { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "pending";
        public string ApprovalFlow { get; set; } = "[]"; // JSON
        public string SubmittedDate { get; set; } = string.Empty;
        public string? ApproverComment { get; set; }
        public string? ApproverId { get; set; }
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }

    public class LeaveBalance : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string LeaveType { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public int Total { get; set; }
        public int Used { get; set; }
        public int Pending { get; set; }
        public int Available { get; set; }
        public int CarriedForward { get; set; }
        public string Color { get; set; } = "#0d9488";
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
