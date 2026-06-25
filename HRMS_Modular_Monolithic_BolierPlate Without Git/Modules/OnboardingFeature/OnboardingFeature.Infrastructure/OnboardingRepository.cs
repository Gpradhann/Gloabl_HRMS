using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OnboardingFeature.Domain;
using OnboardingFeature.Application.Repository;

namespace OnboardingFeature.Infrastructure
{
    public class OnboardingEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OnboardingEmployee>(entity =>
            {
                entity.ToTable("OnboardingEmployees");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class OnboardingRepository : PostgresDbRepository<OnboardingEmployee>, IOnboardingRepository
    {
        public OnboardingRepository(PostgresDbContext context, ILogger<OnboardingRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "OnboardingEmployees";
        public override string GenerateId(OnboardingEmployee entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<OnboardingEmployee>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "OnboardingEmployees", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<OnboardingEmployee>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "OnboardingEmployees" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
