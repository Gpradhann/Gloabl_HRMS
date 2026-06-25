using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PerformanceFeature.Domain;
using PerformanceFeature.Application.Repository;

namespace PerformanceFeature.Infrastructure
{
    public class PerformanceEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Goal>(entity =>
            {
                entity.ToTable("Goals");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });

            modelBuilder.Entity<PerformanceReview>(entity =>
            {
                entity.ToTable("PerformanceReviews");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.ToTable("Feedbacks");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class PerformanceRepository : PostgresDbRepository<Goal>, IPerformanceRepository
    {
        public PerformanceRepository(PostgresDbContext context, ILogger<PerformanceRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "Goals";
        public override string GenerateId(Goal entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<Goal>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "Goals", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<Goal>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "Goals" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }

    public class PerformanceReviewRepository : PostgresDbRepository<PerformanceReview>, IPerformanceReviewRepository
    {
        public PerformanceReviewRepository(PostgresDbContext context, ILogger<PerformanceReviewRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "PerformanceReviews";
        public override string GenerateId(PerformanceReview entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<PerformanceReview>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "PerformanceReviews", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<PerformanceReview>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "PerformanceReviews" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }

    public class FeedbackRepository : PostgresDbRepository<Feedback>, IFeedbackRepository
    {
        public FeedbackRepository(PostgresDbContext context, ILogger<FeedbackRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "Feedbacks";
        public override string GenerateId(Feedback entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<Feedback>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "Feedbacks", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<Feedback>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "Feedbacks" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
