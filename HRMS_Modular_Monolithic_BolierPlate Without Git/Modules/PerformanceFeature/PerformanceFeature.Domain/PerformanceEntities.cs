using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;
namespace PerformanceFeature.Domain
{
    public class Goal : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = "individual";
        public string Type { get; set; } = "quarterly";
        public int Weight { get; set; }
        public string DueDate { get; set; } = string.Empty;
        public string Status { get; set; } = "in-progress";
        public int Progress { get; set; }
        public string KeyResults { get; set; } = "[]"; // JSON
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }

    public class PerformanceReview : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string ReviewType { get; set; } = "quarterly";
        public string Period { get; set; } = string.Empty;
        public double OverallRating { get; set; }
        public double MaxRating { get; set; } = 5;
        public string CategoryRatings { get; set; } = "[]"; // JSON
        public string Strengths { get; set; } = "[]"; // JSON
        public string AreasOfImprovement { get; set; } = "[]"; // JSON
        public int GoalsAchieved { get; set; }
        public int TotalGoals { get; set; }
        public string Recommendations { get; set; } = string.Empty;
        public string? EmployeeComments { get; set; }
        public string ReviewDate { get; set; } = string.Empty;
        public string ReviewerName { get; set; } = string.Empty;
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }

    public class Feedback : BaseEntity
    {
        public string FromEmployee { get; set; } = string.Empty;
        public string ToEmployee { get; set; } = string.Empty;
        public string Type { get; set; } = "peer";
        public string Message { get; set; } = string.Empty;
        public double? Rating { get; set; }
        public string Date { get; set; } = string.Empty;
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
