using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace DocumentFeature.Domain
{
    public class HrmsDocument : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = "identity";
        public string Status { get; set; } = "missing";
        public string? FileName { get; set; }
        public long? FileSize { get; set; }
        public string? FileType { get; set; }
        public string? UploadDate { get; set; }
        public string? VerifiedDate { get; set; }
        public string? RejectionReason { get; set; }
        public string? ExpiryDate { get; set; }
        public bool IsRequired { get; set; } = true;
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
