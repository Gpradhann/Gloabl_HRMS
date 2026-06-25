using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using OnboardingFeature.Application.Repository;

namespace OnboardingFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddOnboardingDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, OnboardingEntityConfigurator>());
            services.AddScoped<IOnboardingRepository, OnboardingRepository>();
            return services;
        }
    }
}
