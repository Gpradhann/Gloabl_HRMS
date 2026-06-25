using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using AttendanceFeature.Domain;
using AttendanceFeature.Application.Repository;

namespace AttendanceFeature.Infrastructure
{
    public class AttendanceEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AttendanceRecord>(entity =>
            {
                entity.ToTable("AttendanceRecords");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class AttendanceRepository : PostgresDbRepository<AttendanceRecord>, IAttendanceRepository
    {
        public AttendanceRepository(PostgresDbContext context, ILogger<AttendanceRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "AttendanceRecords";
        public override string GenerateId(AttendanceRecord entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<AttendanceRecord>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "AttendanceRecords", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<AttendanceRecord>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "AttendanceRecords" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
