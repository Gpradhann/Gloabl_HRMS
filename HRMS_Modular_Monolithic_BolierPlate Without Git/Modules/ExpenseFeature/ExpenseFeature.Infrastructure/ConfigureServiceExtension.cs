using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ExpenseFeature.Application.Repository;

namespace ExpenseFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddExpenseDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, ExpenseEntityConfigurator>());
            services.AddScoped<IExpenseRepository, ExpenseRepository>();
            return services;
        }
    }
}
