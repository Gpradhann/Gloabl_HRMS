using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ExpenseFeature.Domain;
using ExpenseFeature.Application.Repository;

namespace ExpenseFeature.Infrastructure
{
    public class ExpenseEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Reimbursement>(entity =>
            {
                entity.ToTable("Reimbursements");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class ExpenseRepository : PostgresDbRepository<Reimbursement>, IExpenseRepository
    {
        public ExpenseRepository(PostgresDbContext context, ILogger<ExpenseRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "Reimbursements";
        public override string GenerateId(Reimbursement entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<Reimbursement>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "Reimbursements", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<Reimbursement>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "Reimbursements" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
