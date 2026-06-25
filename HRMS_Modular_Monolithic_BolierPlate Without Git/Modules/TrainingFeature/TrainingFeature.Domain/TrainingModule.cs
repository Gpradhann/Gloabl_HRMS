using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;
namespace TrainingFeature.Domain
{
    public class TrainingModule : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = "compliance";
        public int DurationMinutes { get; set; }
        public string DueDate { get; set; } = string.Empty;
        public bool IsMandatory { get; set; }
        public bool IsCertificateEligible { get; set; }
        public int Progress { get; set; }
        public string Status { get; set; } = "not-started";
        public string Contents { get; set; } = "[]"; // JSON
        public string? CertificateId { get; set; }
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
