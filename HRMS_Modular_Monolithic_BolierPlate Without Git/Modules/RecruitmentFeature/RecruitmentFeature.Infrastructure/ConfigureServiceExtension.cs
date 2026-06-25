using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using RecruitmentFeature.Application.Repository;

namespace RecruitmentFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddRecruitmentDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, RecruitmentEntityConfigurator>());
            services.AddScoped<IRecruitmentRepository, RecruitmentRepository>();
            services.AddScoped<IJobPostingRepository, JobPostingRepository>();
            return services;
        }
    }
}
