using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using LeaveFeature.Domain;
using LeaveFeature.Application.Repository;

namespace LeaveFeature.Infrastructure
{
    public class LeaveEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LeaveRequest>(entity =>
            {
                entity.ToTable("LeaveRequests");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });

            modelBuilder.Entity<LeaveBalance>(entity =>
            {
                entity.ToTable("LeaveBalances");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class LeaveRepository : PostgresDbRepository<LeaveRequest>, ILeaveRepository
    {
        public LeaveRepository(PostgresDbContext context, ILogger<LeaveRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "LeaveRequests";
        public override string GenerateId(LeaveRequest entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<LeaveRequest>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "LeaveRequests", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<LeaveRequest>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "LeaveRequests" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }

    public class LeaveBalanceRepository : PostgresDbRepository<LeaveBalance>, ILeaveBalanceRepository
    {
        public LeaveBalanceRepository(PostgresDbContext context, ILogger<LeaveBalanceRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "LeaveBalances";
        public override string GenerateId(LeaveBalance entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<LeaveBalance>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "LeaveBalances", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<LeaveBalance>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "LeaveBalances" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
