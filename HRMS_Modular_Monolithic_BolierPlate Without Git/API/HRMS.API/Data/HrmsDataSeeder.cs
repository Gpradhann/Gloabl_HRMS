using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres.Data;
using EmployeeFeature.Domain;
using AttendanceFeature.Domain;
using LeaveFeature.Domain;
using PayrollFeature.Domain;
using DocumentFeature.Domain;
using ExpenseFeature.Domain;
using PerformanceFeature.Domain;
using ContributionFeature.Domain;
using TrainingFeature.Domain;
using RecruitmentFeature.Domain;
using RecognitionFeature.Domain;
using AnnouncementFeature.Domain;
using NotificationFeature.Domain;
using OnboardingFeature.Domain;
using TodoFeature.Domain;

namespace HRMS.API.Data
{
    public static class HrmsDataSeeder
    {
        public static async Task SeedAsync(PostgresDbContext context)
        {
            // Seed Employees
            if (!await context.Set<Employee>().AnyAsync())
            {
                var employees = new List<Employee>
                {
                    new() { Id = "emp-001", Name = "Sarah Johnson", Email = "sarah.johnson@workflow.com", Initials = "SJ", Color = "#0d9488", Designation = "Senior Software Engineer", Department = "Engineering", EmploymentStatus = "active", Role = "Employee", ManagerId = "emp-002", ReportingManager = "Michael Chen", JoiningDate = "2022-03-15", Country = "IN", Location = "Bangalore, India", Phone = "+91 98765 43210", EmployeeCode = "WF-2022-001", EmploymentType = "full-time", Skills = "[\"React\", \"TypeScript\", \"Node.js\", \"AWS\"]", UserId = "emp-001" },
                    new() { Id = "emp-002", Name = "Michael Chen", Email = "michael.chen@workflow.com", Initials = "MC", Color = "#6366f1", Designation = "Engineering Manager", Department = "Engineering", EmploymentStatus = "active", Role = "Manager", ManagerId = "emp-010", ReportingManager = "Arun Krishnamurthy", JoiningDate = "2020-07-01", Country = "IN", Location = "Bangalore, India", Phone = "+91 98765 43211", EmployeeCode = "WF-2020-002", EmploymentType = "full-time", Skills = "[\"System Architecture\", \"Leadership\", \"Agile\"]", UserId = "emp-002" },
                    new() { Id = "emp-003", Name = "Priya Sharma", Email = "priya.sharma@workflow.com", Initials = "PS", Color = "#f97316", Designation = "HR Specialist", Department = "Human Resources", EmploymentStatus = "active", Role = "HR", ManagerId = "emp-004", ReportingManager = "David Williams", JoiningDate = "2021-01-10", Country = "IN", Location = "Mumbai, India", Phone = "+91 98765 43212", EmployeeCode = "WF-2021-003", EmploymentType = "full-time", Skills = "[\"HRIS\", \"Employee Relations\"]", UserId = "emp-003" },
                    new() { Id = "emp-004", Name = "David Williams", Email = "david.williams@workflow.com", Initials = "DW", Color = "#8b5cf6", Designation = "Chief People Officer", Department = "Human Resources", EmploymentStatus = "active", Role = "Admin", JoiningDate = "2019-05-20", Country = "US", Location = "New York, USA", Phone = "+1 212 555 0101", EmployeeCode = "WF-2019-004", EmploymentType = "full-time", Skills = "[\"HR Strategy\", \"Compliance\"]", UserId = "emp-004" }
                };
                foreach (var emp in employees) emp.SetCustomDocumentType("Employees");
                await context.Set<Employee>().AddRangeAsync(employees);
                await context.SaveChangesAsync();
            }

            // Seed AttendanceRecords
            if (!await context.Set<AttendanceRecord>().AnyAsync())
            {
                var records = new List<AttendanceRecord>
                {
                    new() { Id = "att-001", EmployeeId = "emp-001", Date = "2026-06-23", ClockIn = "09:02", ClockOut = "18:15", Status = "present", ProductiveHours = 8.5, BreakHours = 0.72, OvertimeHours = 0.25, TotalHours = 9.22, ClockMethod = "selfie", LocationVerified = true, IpValidated = true, ShiftName = "General Shift", UserId = "emp-001" },
                    new() { Id = "att-002", EmployeeId = "emp-001", Date = "2026-06-22", ClockIn = "09:30", ClockOut = "18:00", Status = "late", ProductiveHours = 7.5, BreakHours = 1.0, OvertimeHours = 0, TotalHours = 8.5, ClockMethod = "selfie", LocationVerified = true, IpValidated = true, ShiftName = "General Shift", ExceptionFlag = "Late arrival", UserId = "emp-001" },
                    new() { Id = "att-003", EmployeeId = "emp-001", Date = "2026-06-21", ClockIn = "08:58", ClockOut = "18:02", Status = "present", ProductiveHours = 8.5, BreakHours = 0.6, OvertimeHours = 0, TotalHours = 9.07, ClockMethod = "selfie", LocationVerified = true, IpValidated = true, ShiftName = "General Shift", UserId = "emp-001" }
                };
                foreach (var r in records) r.SetCustomDocumentType("AttendanceRecords");
                await context.Set<AttendanceRecord>().AddRangeAsync(records);
                await context.SaveChangesAsync();
            }

            // Seed LeaveBalances
            if (!await context.Set<LeaveBalance>().AnyAsync())
            {
                var balances = new List<LeaveBalance>
                {
                    new() { Id = "lb-001", EmployeeId = "emp-001", LeaveType = "casual", Label = "Casual Leave", Total = 12, Used = 5, Pending = 1, Available = 6, CarriedForward = 0, Color = "#0d9488", UserId = "emp-001" },
                    new() { Id = "lb-002", EmployeeId = "emp-001", LeaveType = "sick", Label = "Sick Leave", Total = 10, Used = 2, Pending = 0, Available = 8, Color = "#6366f1", UserId = "emp-001" },
                    new() { Id = "lb-003", EmployeeId = "emp-001", LeaveType = "personal", Label = "Personal Leave", Total = 6, Used = 1, Pending = 0, Available = 5, Color = "#f97316", UserId = "emp-001" }
                };
                foreach (var b in balances) b.SetCustomDocumentType("LeaveBalances");
                await context.Set<LeaveBalance>().AddRangeAsync(balances);
                await context.SaveChangesAsync();
            }

            // Seed LeaveRequests
            if (!await context.Set<LeaveRequest>().AnyAsync())
            {
                var requests = new List<LeaveRequest>
                {
                    new() { Id = "lv-001", EmployeeId = "emp-001", EmployeeName = "Sarah Johnson", EmployeeInitials = "SJ", LeaveType = "casual", StartDate = "2026-07-10", EndDate = "2026-07-12", TotalDays = 3, Reason = "Family vacation.", Status = "pending", ApprovalFlow = "[{\"approver\":\"Michael Chen\",\"role\":\"Manager\",\"status\":\"pending\"}]", SubmittedDate = "2026-06-20", UserId = "emp-001" },
                    new() { Id = "lv-002", EmployeeId = "emp-001", EmployeeName = "Sarah Johnson", EmployeeInitials = "SJ", LeaveType = "sick", StartDate = "2026-06-15", EndDate = "2026-06-15", TotalDays = 1, Reason = "Fever.", Status = "approved", ApprovalFlow = "[{\"approver\":\"Michael Chen\",\"role\":\"Manager\",\"status\":\"approved\",\"date\":\"2026-06-14\",\"comment\":\"Get well soon!\"}]", SubmittedDate = "2026-06-14", UserId = "emp-001" }
                };
                foreach (var req in requests) req.SetCustomDocumentType("LeaveRequests");
                await context.Set<LeaveRequest>().AddRangeAsync(requests);
                await context.SaveChangesAsync();
            }

            // Seed PayrollRecords
            if (!await context.Set<PayrollRecord>().AnyAsync())
            {
                var payrolls = new List<PayrollRecord>
                {
                    new() { Id = "pay-001", EmployeeId = "emp-001", PayPeriod = "June 2026", PayDate = "2026-06-30", Country = "IN", Status = "paid", Currency = "INR", BasicSalary = 80000, Hra = 32000, SpecialAllowance = 25000, Bonus = 10000, OvertimePay = 1500, Reimbursements = 5400, GrossPay = 153900, IncomeTax = 18000, ProvidentFund = 9600, HealthInsurance = 2500, ProfessionalTax = 200, TotalDeductions = 30300, NetPay = 123600, UserId = "emp-001" }
                };
                foreach (var p in payrolls) p.SetCustomDocumentType("PayrollRecords");
                await context.Set<PayrollRecord>().AddRangeAsync(payrolls);
                await context.SaveChangesAsync();
            }

            // Seed HrmsDocuments
            if (!await context.Set<HrmsDocument>().AnyAsync())
            {
                var docs = new List<HrmsDocument>
                {
                    new() { Id = "doc-001", EmployeeId = "emp-001", Name = "PAN Card", Category = "identity", Status = "verified", FileName = "pan_card.pdf", FileSize = 1048576, FileType = "application/pdf", UploadDate = "2022-03-16", VerifiedDate = "2022-03-17", IsRequired = true, UserId = "emp-001" },
                    new() { Id = "doc-002", EmployeeId = "emp-001", Name = "Passport Copy", Category = "identity", Status = "uploaded", FileName = "passport_draft.jpg", FileSize = 2048576, FileType = "image/jpeg", UploadDate = "2026-06-20", IsRequired = true, UserId = "emp-001" }
                };
                foreach (var d in docs) d.SetCustomDocumentType("HrmsDocuments");
                await context.Set<HrmsDocument>().AddRangeAsync(docs);
                await context.SaveChangesAsync();
            }

            // Seed Reimbursements
            if (!await context.Set<Reimbursement>().AnyAsync())
            {
                var expenses = new List<Reimbursement>
                {
                    new() { Id = "exp-001", EmployeeId = "emp-001", EmployeeName = "Sarah Johnson", EmployeeInitials = "SJ", Category = "travel", Amount = 1200, Currency = "INR", Description = "Client visit in Whitefield", Date = "2026-06-22", IsMileage = false, IsTaxable = false, Status = "approved", PolicyValid = true, ApprovalFlow = "[{\"approver\":\"Michael Chen\",\"status\":\"approved\",\"date\":\"2026-06-23\"}]", PaidDate = "2026-06-24", UserId = "emp-001" }
                };
                foreach (var exp in expenses) exp.SetCustomDocumentType("Reimbursements");
                await context.Set<Reimbursement>().AddRangeAsync(expenses);
                await context.SaveChangesAsync();
            }

            // Seed Goals
            if (!await context.Set<Goal>().AnyAsync())
            {
                var goals = new List<Goal>
                {
                    new() { Id = "goal-001", EmployeeId = "emp-001", Title = "Deliver HRMS Integration", Description = "Complete API integrations and frontend wiring", Category = "individual", Type = "quarterly", Weight = 40, DueDate = "2026-06-26", Status = "in-progress", Progress = 75, KeyResults = "[{\"title\":\"Wire pages to React Query\",\"target\":12,\"current\":6}]", UserId = "emp-001" }
                };
                foreach (var g in goals) g.SetCustomDocumentType("Goals");
                await context.Set<Goal>().AddRangeAsync(goals);
                await context.SaveChangesAsync();
            }

            // Seed PerformanceReviews
            if (!await context.Set<PerformanceReview>().AnyAsync())
            {
                var reviews = new List<PerformanceReview>
                {
                    new() { Id = "rev-001", EmployeeId = "emp-001", ReviewType = "annual", Period = "FY 2025-2026", OverallRating = 4.5, MaxRating = 5, CategoryRatings = "[]", Strengths = "[\"Excellent technical design\", \"Reliable code execution\"]", AreasOfImprovement = "[\"Delegate more tasks to juniors\"]", GoalsAchieved = 4, TotalGoals = 5, Recommendations = "Promote to Lead Software Engineer", ReviewDate = "2026-04-15", ReviewerName = "Michael Chen", UserId = "emp-001" }
                };
                foreach (var rev in reviews) rev.SetCustomDocumentType("PerformanceReviews");
                await context.Set<PerformanceReview>().AddRangeAsync(reviews);
                await context.SaveChangesAsync();
            }

            // Seed Feedbacks
            if (!await context.Set<Feedback>().AnyAsync())
            {
                var feedbacks = new List<Feedback>
                {
                    new() { Id = "fb-001", FromEmployee = "emp-005", ToEmployee = "emp-001", Type = "peer", Message = "Sarah was extremely helpful in unblocking my UI challenges.", Rating = 5, Date = "2026-06-21", UserId = "emp-001" }
                };
                foreach (var fb in feedbacks) fb.SetCustomDocumentType("Feedbacks");
                await context.Set<Feedback>().AddRangeAsync(feedbacks);
                await context.SaveChangesAsync();
            }

            // Seed ValueContributions
            if (!await context.Set<ValueContribution>().AnyAsync())
            {
                var contributions = new List<ValueContribution>
                {
                    new() { Id = "con-001", EmployeeId = "emp-001", EmployeeName = "Sarah Johnson", EmployeeInitials = "SJ", Title = "Dockerized Local Env", Description = "Reduced developer onboarding from days to minutes.", Type = "self-initiated", Category = "process-improvement", SuggestedPoints = 150, FinalPoints = 150, ImpactLevel = "high", Tags = "[\"Docker\", \"Developer Productivity\"]", Status = "completed", ApprovalFlow = "[{\"approver\":\"Michael Chen\",\"role\":\"Manager\",\"status\":\"approved\"}]", CreatedDate = "2026-05-10", UserId = "emp-001" }
                };
                foreach (var c in contributions) c.SetCustomDocumentType("ValueContributions");
                await context.Set<ValueContribution>().AddRangeAsync(contributions);
                await context.SaveChangesAsync();
            }

            // Seed ContributionItems
            if (!await context.Set<ContributionItem>().AnyAsync())
            {
                var items = new List<ContributionItem>
                {
                    new() { Id = "ci-001", Title = "Migrate styling to Tailwind CSS v4", Description = "Upgrade modular layouts to Tailwind v4 theme specifications.", Category = "process-improvement", SuggestedPoints = 200, IsAvailable = true, ImpactLevel = "high", UserId = "emp-001" }
                };
                foreach (var i in items) i.SetCustomDocumentType("ContributionItems");
                await context.Set<ContributionItem>().AddRangeAsync(items);
                await context.SaveChangesAsync();
            }

            // Seed ContributionLeaderboardEntries
            if (!await context.Set<ContributionLeaderboardEntry>().AnyAsync())
            {
                var leaderboard = new List<ContributionLeaderboardEntry>
                {
                    new() { Id = "cl-001", EmployeeId = "emp-001", EmployeeName = "Sarah Johnson", EmployeeInitials = "SJ", Department = "Engineering", TotalPoints = 350, Rank = 1, Badges = "[\"Innovator\", \"Process Expert\"]", AverageRating = 4.8, Color = "#0d9488", UserId = "emp-001" }
                };
                foreach (var cl in leaderboard) cl.SetCustomDocumentType("ContributionLeaderboard");
                await context.Set<ContributionLeaderboardEntry>().AddRangeAsync(leaderboard);
                await context.SaveChangesAsync();
            }

            // Seed TrainingModules
            if (!await context.Set<TrainingModule>().AnyAsync())
            {
                var modules = new List<TrainingModule>
                {
                    new() { Id = "tr-001", EmployeeId = "emp-001", Title = "Cybersecurity Best Practices", Description = "Learn about phishing, 2FA, and secure development.", Category = "compliance", DurationMinutes = 45, DueDate = "2026-06-30", IsMandatory = true, IsCertificateEligible = true, Progress = 80, Status = "in-progress", Contents = "[{\"id\":\"tc-001\",\"title\":\"Introduction to Cybersecurity\",\"type\":\"video\",\"duration\":15,\"completed\":true}]", UserId = "emp-001" }
                };
                foreach (var m in modules) m.SetCustomDocumentType("TrainingModules");
                await context.Set<TrainingModule>().AddRangeAsync(modules);
                await context.SaveChangesAsync();
            }

            // Seed JobPostings
            if (!await context.Set<JobPosting>().AnyAsync())
            {
                var jobs = new List<JobPosting>
                {
                    new() { Id = "job-001", Title = "Senior Frontend Developer", Department = "Engineering", Location = "Bangalore, India", EmploymentType = "full-time", ExperienceMin = 5, ExperienceMax = 8, SalaryMin = 1500000, SalaryMax = 2200000, Currency = "INR", Requirements = "[\"React\", \"Next.js\", \"TypeScript\"]", Responsibilities = "[\"Maintain Design System\"]", Status = "active", ApplicantsCount = 12, ShortlistedCount = 3, InterviewingCount = 2, PostedDate = "2026-06-01", UserId = "emp-001" }
                };
                foreach (var j in jobs) j.SetCustomDocumentType("JobPostings");
                await context.Set<JobPosting>().AddRangeAsync(jobs);
                await context.SaveChangesAsync();
            }

            // Seed Candidates
            if (!await context.Set<Candidate>().AnyAsync())
            {
                var candidates = new List<Candidate>
                {
                    new() { Id = "cand-001", JobPostingId = "job-001", Name = "Vikram Aditya", Email = "vikram.aditya@gmail.com", Phone = "+91 99000 88888", Initials = "VA", AppliedRole = "Senior Frontend Developer", Skills = "[\"React\", \"Redux\", \"TypeScript\"]", ExperienceYears = 6, ExpectedSalary = 1800000, Currency = "INR", NoticePeriodDays = 30, Rating = 4.2, Notes = "Good communication, strong technical base.", Status = "interview-scheduled", AppliedDate = "2026-06-10", InterviewDate = "2026-06-25", Color = "#0d9488", UserId = "job-001" }
                };
                foreach (var c in candidates) c.SetCustomDocumentType("Candidates");
                await context.Set<Candidate>().AddRangeAsync(candidates);
                await context.SaveChangesAsync();
            }

            // Seed Recognition
            if (!await context.Set<Recognition>().AnyAsync())
            {
                var recognitions = new List<Recognition>
                {
                    new() { Id = "rec-001", FromEmployeeId = "emp-002", FromEmployeeName = "Michael Chen", FromEmployeeInitials = "MC", ToEmployeeId = "emp-001", ToEmployeeName = "Sarah Johnson", ToEmployeeInitials = "SJ", Category = "excellence", Message = "Outstanding job delivering the HRMS monolithic design under tight deadlines!", IsPublic = true, LikesCount = 5, CommentsCount = 2, Date = "2026-06-24", FromColor = "#6366f1", ToColor = "#0d9488", LikedBy = "[]", UserId = "emp-001" }
                };
                foreach (var r in recognitions) r.SetCustomDocumentType("Recognitions");
                await context.Set<Recognition>().AddRangeAsync(recognitions);
                await context.SaveChangesAsync();
            }

            // Seed Announcements
            if (!await context.Set<Announcement>().AnyAsync())
            {
                var announcements = new List<Announcement>
                {
                    new() { Id = "ann-001", Title = "HRMS Project Launch", Content = "The new Global HRMS portal is officially going live this month.", Category = "hr-update", Priority = "high", VisibilityScope = "global", PublishedDate = "2026-06-24", PublishedBy = "Priya Sharma", Views = 42, Likes = 8, Acknowledgments = 15, Comments = 3, RequiresAcknowledgment = true, AcknowledgedBy = "[\"emp-001\"]", LikedBy = "[]", UserId = "emp-001" }
                };
                foreach (var a in announcements) a.SetCustomDocumentType("Announcements");
                await context.Set<Announcement>().AddRangeAsync(announcements);
                await context.SaveChangesAsync();
            }

            // Seed Notifications
            if (!await context.Set<HrmsNotification>().AnyAsync())
            {
                var notifications = new List<HrmsNotification>
                {
                    new() { Id = "not-001", Type = "leave", Message = "Sarah Johnson submitted a casual leave request.", Timestamp = "2026-06-23T10:00:00Z", Read = false, Href = "/leave", Icon = "calendar", ForRoles = "[\"Manager\"]", ForEmployeeId = "emp-002", UserId = "emp-002" }
                };
                foreach (var n in notifications) n.SetCustomDocumentType("Notifications");
                await context.Set<HrmsNotification>().AddRangeAsync(notifications);
                await context.SaveChangesAsync();
            }

            // Seed OnboardingEmployee
            if (!await context.Set<OnboardingEmployee>().AnyAsync())
            {
                var alexOnboarding = new OnboardingEmployee
                {
                    Id = "onb-001",
                    EmployeeId = "emp-011",
                    Name = "Alex Kumar",
                    Designation = "Full Stack Developer",
                    Department = "Engineering",
                    Manager = "Michael Chen",
                    Buddy = "Sarah Johnson",
                    JoiningDate = "2026-07-01",
                    ProgressPercent = 45,
                    IsComplete = false,
                    Tasks = "[{\"id\":\"ot-001\",\"title\":\"Sign Offer Letter\",\"description\":\"Digitally sign offer letter.\",\"phase\":\"pre-joining\",\"priority\":\"high\",\"dueDate\":\"2026-06-15\",\"assignee\":\"Alex Kumar\",\"status\":\"completed\",\"completedDate\":\"2026-06-14\"},{\"id\":\"ot-004\",\"title\":\"Upload Identity Documents\",\"description\":\"Upload Aadhaar, PAN card.\",\"phase\":\"pre-joining\",\"priority\":\"high\",\"dueDate\":\"2026-06-25\",\"assignee\":\"Alex Kumar\",\"status\":\"in-progress\"}]",
                    WelcomeMessages = "[{\"id\":\"wm-001\",\"senderName\":\"Arun Krishnamurthy\",\"senderRole\":\"CEO\",\"message\":\"Alex, welcome to WorkFlow!\",\"hasVideo\":true,\"avatarInitials\":\"AK\",\"color\":\"#0d9488\"}]",
                    TeamIntroductions = "[{\"employeeId\":\"emp-002\",\"name\":\"Michael Chen\",\"designation\":\"Engineering Manager\",\"department\":\"Engineering\",\"bio\":\"Manager bio.\",\"expertise\":[\"System Architecture\"],\"funFact\":\"Plays tabla!\",\"initials\":\"MC\",\"color\":\"#6366f1\",\"introductionStatus\":\"pending\"}]",
                    Milestones = "[{\"id\":\"ms-001\",\"title\":\"Day 1 Welcome Celebration\",\"description\":\"Lunch!\",\"scheduledDate\":\"2026-07-01\",\"status\":\"upcoming\",\"type\":\"celebration\"}]",
                    UserId = "emp-011"
                };
                alexOnboarding.SetCustomDocumentType("OnboardingEmployees");
                await context.Set<OnboardingEmployee>().AddAsync(alexOnboarding);
                await context.SaveChangesAsync();
            }

            // Seed Todos
            if (!await context.Set<Todo>().AnyAsync())
            {
                var todos = new List<Todo>
                {
                    new() { Id = "todo-001", Title = "Approve Leave Requests", Description = "Review and approve pending leave requests for the team.", DueDate = DateTime.UtcNow.AddDays(2), IsCompleted = false, UserId = "emp-002", UserContext = new HRMS.Shared.Domain.Entity.UserBase { UserId = "emp-002", UserName = "Michael Chen" } },
                    new() { Id = "todo-002", Title = "Submit Weekly Report", Description = "Compile and submit progress report for the current sprint.", DueDate = DateTime.UtcNow.AddDays(1), IsCompleted = false, UserId = "emp-001", UserContext = new HRMS.Shared.Domain.Entity.UserBase { UserId = "emp-001", UserName = "Sarah Johnson" } },
                    new() { Id = "todo-003", Title = "Complete Security Training", Description = "Mandatory quarterly compliance training course.", DueDate = DateTime.UtcNow.AddDays(5), IsCompleted = true, UserId = "emp-001", UserContext = new HRMS.Shared.Domain.Entity.UserBase { UserId = "emp-001", UserName = "Sarah Johnson" } }
                };
                foreach (var t in todos) t.SetCustomDocumentType("Todo");
                await context.Set<Todo>().AddRangeAsync(todos);
                await context.SaveChangesAsync();
            }
        }
    }
}
