using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PayrollFeature.Domain;
using PayrollFeature.Application.Repository;

namespace PayrollFeature.Infrastructure
{
    public class PayrollEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PayrollRecord>(entity =>
            {
                entity.ToTable("PayrollRecords");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class PayrollRepository : PostgresDbRepository<PayrollRecord>, IPayrollRepository
    {
        public PayrollRepository(PostgresDbContext context, ILogger<PayrollRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "PayrollRecords";
        public override string GenerateId(PayrollRecord entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<PayrollRecord>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "PayrollRecords", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<PayrollRecord>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "PayrollRecords" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
