using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;
namespace ExpenseFeature.Domain
{
    public class Reimbursement : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeInitials { get; set; } = string.Empty;
        public string Category { get; set; } = "travel";
        public double Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string Description { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public bool IsMileage { get; set; }
        public double? MileageKm { get; set; }
        public string? MileageFrom { get; set; }
        public string? MileageTo { get; set; }
        public double? RatePerKm { get; set; }
        public bool IsTaxable { get; set; }
        public string Status { get; set; } = "submitted";
        public bool PolicyValid { get; set; } = true;
        public string? PolicyMessage { get; set; }
        public string ApprovalFlow { get; set; } = "[]";
        public string? PaidDate { get; set; }
        public string? ApproverComment { get; set; }
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
