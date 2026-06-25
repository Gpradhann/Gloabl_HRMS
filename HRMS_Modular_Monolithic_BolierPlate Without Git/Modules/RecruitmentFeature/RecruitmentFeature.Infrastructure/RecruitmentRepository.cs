using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RecruitmentFeature.Domain;
using RecruitmentFeature.Application.Repository;

namespace RecruitmentFeature.Infrastructure
{
    public class RecruitmentEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Candidate>(entity =>
            {
                entity.ToTable("Candidates");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });

            modelBuilder.Entity<JobPosting>(entity =>
            {
                entity.ToTable("JobPostings");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class RecruitmentRepository : PostgresDbRepository<Candidate>, IRecruitmentRepository
    {
        public RecruitmentRepository(PostgresDbContext context, ILogger<RecruitmentRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "Candidates";
        public override string GenerateId(Candidate entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<Candidate>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "Candidates", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<Candidate>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "Candidates" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }

    public class JobPostingRepository : PostgresDbRepository<JobPosting>, IJobPostingRepository
    {
        public JobPostingRepository(PostgresDbContext context, ILogger<JobPostingRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "JobPostings";
        public override string GenerateId(JobPosting entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<JobPosting>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "JobPostings", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<JobPosting>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "JobPostings" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
