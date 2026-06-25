using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
namespace TeamFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddTeamDependency(this IServiceCollection services, IConfiguration configuration)
            => services; // Team uses EmployeeRepository
    }
}
