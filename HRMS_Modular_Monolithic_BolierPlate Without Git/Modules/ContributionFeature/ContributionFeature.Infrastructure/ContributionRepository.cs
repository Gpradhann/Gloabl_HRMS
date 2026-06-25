using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ContributionFeature.Domain;
using ContributionFeature.Application.Repository;

namespace ContributionFeature.Infrastructure
{
    public class ContributionEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ValueContribution>(entity =>
            {
                entity.ToTable("ValueContributions");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });

            modelBuilder.Entity<ContributionItem>(entity =>
            {
                entity.ToTable("ContributionItems");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });

            modelBuilder.Entity<ContributionLeaderboardEntry>(entity =>
            {
                entity.ToTable("ContributionLeaderboard");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class ContributionRepository : PostgresDbRepository<ValueContribution>, IContributionRepository
    {
        public ContributionRepository(PostgresDbContext context, ILogger<ContributionRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "ValueContributions";
        public override string GenerateId(ValueContribution entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<ValueContribution>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "ValueContributions", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<ValueContribution>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "ValueContributions" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }

    public class ContributionItemRepository : PostgresDbRepository<ContributionItem>, IContributionItemRepository
    {
        public ContributionItemRepository(PostgresDbContext context, ILogger<ContributionItemRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "ContributionItems";
        public override string GenerateId(ContributionItem entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<ContributionItem>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "ContributionItems", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<ContributionItem>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "ContributionItems" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }

    public class ContributionLeaderboardRepository : PostgresDbRepository<ContributionLeaderboardEntry>, IContributionLeaderboardRepository
    {
        public ContributionLeaderboardRepository(PostgresDbContext context, ILogger<ContributionLeaderboardRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "ContributionLeaderboard";
        public override string GenerateId(ContributionLeaderboardEntry entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<ContributionLeaderboardEntry>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "ContributionLeaderboard", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<ContributionLeaderboardEntry>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "ContributionLeaderboard" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
