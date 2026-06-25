using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace EmployeeFeature.Domain
{
    public class Employee : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Initials { get; set; } = string.Empty;
        public string Color { get; set; } = "#0d9488";
        public string Designation { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string EmploymentStatus { get; set; } = "active";
        public string Role { get; set; } = "Employee";
        public string? ManagerId { get; set; }
        public string? ReportingManager { get; set; }
        public string JoiningDate { get; set; } = string.Empty;
        public string Country { get; set; } = "US";
        public string Location { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string EmploymentType { get; set; } = "full-time";
        public string? Skills { get; set; } // JSON array stored as string
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
