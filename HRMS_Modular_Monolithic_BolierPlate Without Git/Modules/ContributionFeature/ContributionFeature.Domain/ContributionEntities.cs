using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;
namespace ContributionFeature.Domain
{
    public class ValueContribution : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeInitials { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = "self-initiated";
        public string Category { get; set; } = "innovation";
        public int SuggestedPoints { get; set; }
        public int? FinalPoints { get; set; }
        public string ImpactLevel { get; set; } = "medium";
        public string Tags { get; set; } = "[]"; // JSON
        public string Status { get; set; } = "proposal-pending";
        public string ApprovalFlow { get; set; } = "[]"; // JSON
        public string CreatedDate { get; set; } = string.Empty;
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }

    public class ContributionItem : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = "innovation";
        public int SuggestedPoints { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string? ClaimedBy { get; set; }
        public string ImpactLevel { get; set; } = "medium";
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }

    public class ContributionLeaderboardEntry : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeInitials { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int TotalPoints { get; set; }
        public int Rank { get; set; }
        public string Badges { get; set; } = "[]"; // JSON
        public double AverageRating { get; set; }
        public string Color { get; set; } = "#0d9488";
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
