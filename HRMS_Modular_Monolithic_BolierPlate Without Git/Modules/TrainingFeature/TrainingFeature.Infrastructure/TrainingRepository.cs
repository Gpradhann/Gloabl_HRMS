using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TrainingFeature.Domain;
using TrainingFeature.Application.Repository;

namespace TrainingFeature.Infrastructure
{
    public class TrainingEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TrainingModule>(entity =>
            {
                entity.ToTable("TrainingModules");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class TrainingRepository : PostgresDbRepository<TrainingModule>, ITrainingRepository
    {
        public TrainingRepository(PostgresDbContext context, ILogger<TrainingRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "TrainingModules";
        public override string GenerateId(TrainingModule entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<TrainingModule>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "TrainingModules", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<TrainingModule>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "TrainingModules" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
