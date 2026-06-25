using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NotificationFeature.Application.Repository;

namespace NotificationFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddNotificationDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, NotificationEntityConfigurator>());
            services.AddScoped<INotificationRepository, NotificationRepository>();
            return services;
        }
    }
}
