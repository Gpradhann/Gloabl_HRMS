using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using AnnouncementFeature.Application.Repository;

namespace AnnouncementFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddAnnouncementDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, AnnouncementEntityConfigurator>());
            services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
            return services;
        }
    }
}
