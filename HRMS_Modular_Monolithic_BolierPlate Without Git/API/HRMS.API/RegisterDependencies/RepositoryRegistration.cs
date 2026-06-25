using TodoFeature.Infrastructure;
using EmployeeFeature.Infrastructure;
using AttendanceFeature.Infrastructure;
using LeaveFeature.Infrastructure;
using PayrollFeature.Infrastructure;
using DocumentFeature.Infrastructure;
using ExpenseFeature.Infrastructure;
using PerformanceFeature.Infrastructure;
using ContributionFeature.Infrastructure;
using TrainingFeature.Infrastructure;
using RecruitmentFeature.Infrastructure;
using RecognitionFeature.Infrastructure;
using AnnouncementFeature.Infrastructure;
using NotificationFeature.Infrastructure;
using OnboardingFeature.Infrastructure;
using TeamFeature.Infrastructure;

namespace HRMS.API.RegisterDependencies
{
    public static class RepositoryRegistration
    {
        public static IServiceCollection AddModulesDependencyInjection(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddTodoDependency(configuration);
            services.AddEmployeeDependency(configuration);
            services.AddAttendanceDependency(configuration);
            services.AddLeaveDependency(configuration);
            services.AddPayrollDependency(configuration);
            services.AddDocumentDependency(configuration);
            services.AddExpenseDependency(configuration);
            services.AddPerformanceDependency(configuration);
            services.AddContributionDependency(configuration);
            services.AddTrainingDependency(configuration);
            services.AddRecruitmentDependency(configuration);
            services.AddRecognitionDependency(configuration);
            services.AddAnnouncementDependency(configuration);
            services.AddNotificationDependency(configuration);
            services.AddOnboardingDependency(configuration);
            services.AddTeamDependency(configuration);
            return services;
        }
    }
}
