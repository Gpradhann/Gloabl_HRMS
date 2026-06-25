using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;
namespace RecruitmentFeature.Domain
{
    public class JobPosting : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string EmploymentType { get; set; } = "full-time";
        public int ExperienceMin { get; set; }
        public int ExperienceMax { get; set; }
        public double SalaryMin { get; set; }
        public double SalaryMax { get; set; }
        public string Currency { get; set; } = "USD";
        public string Requirements { get; set; } = "[]"; // JSON
        public string Responsibilities { get; set; } = "[]"; // JSON
        public string Status { get; set; } = "active";
        public int ApplicantsCount { get; set; }
        public int ShortlistedCount { get; set; }
        public int InterviewingCount { get; set; }
        public string PostedDate { get; set; } = string.Empty;
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }

    public class Candidate : BaseEntity
    {
        public string JobPostingId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Initials { get; set; } = string.Empty;
        public string AppliedRole { get; set; } = string.Empty;
        public string Skills { get; set; } = "[]"; // JSON
        public int ExperienceYears { get; set; }
        public double ExpectedSalary { get; set; }
        public string Currency { get; set; } = "USD";
        public int NoticePeriodDays { get; set; }
        public double Rating { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; } = "new";
        public string AppliedDate { get; set; } = string.Empty;
        public string? InterviewDate { get; set; }
        public string Color { get; set; } = "#0d9488";
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
