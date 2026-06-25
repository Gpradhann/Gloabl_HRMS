using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ContributionFeature.Application.Repository;

namespace ContributionFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddContributionDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, ContributionEntityConfigurator>());
            services.AddScoped<IContributionRepository, ContributionRepository>();
            services.AddScoped<IContributionItemRepository, ContributionItemRepository>();
            services.AddScoped<IContributionLeaderboardRepository, ContributionLeaderboardRepository>();
            return services;
        }
    }
}
