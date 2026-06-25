using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;
namespace OnboardingFeature.Domain
{
    public class OnboardingEmployee : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Manager { get; set; } = string.Empty;
        public string Buddy { get; set; } = string.Empty;
        public string JoiningDate { get; set; } = string.Empty;
        public int ProgressPercent { get; set; }
        public bool IsComplete { get; set; }
        public string Tasks { get; set; } = "[]"; // JSON
        public string WelcomeMessages { get; set; } = "[]"; // JSON
        public string TeamIntroductions { get; set; } = "[]"; // JSON
        public string Milestones { get; set; } = "[]"; // JSON
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
