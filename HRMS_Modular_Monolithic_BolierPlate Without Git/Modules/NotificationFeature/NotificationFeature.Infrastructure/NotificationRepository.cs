using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NotificationFeature.Domain;
using NotificationFeature.Application.Repository;

namespace NotificationFeature.Infrastructure
{
    public class NotificationEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HrmsNotification>(entity =>
            {
                entity.ToTable("HrmsNotifications");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class NotificationRepository : PostgresDbRepository<HrmsNotification>, INotificationRepository
    {
        public NotificationRepository(PostgresDbContext context, ILogger<NotificationRepository> logger,
            ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor) { }

        public override string TableName { get; } = "HrmsNotifications";
        public override string GenerateId(HrmsNotification entity) => Guid.NewGuid().ToString();

        public async Task<IEnumerable<HrmsNotification>> GetAllAsync()
            => (await GetItemsWithCountAsync(x => x.DocumentType == "HrmsNotifications", new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;

        public async Task<IEnumerable<HrmsNotification>> GetByEmployeeIdAsync(string employeeId)
            => (await GetItemsWithCountAsync(x => x.DocumentType == "HrmsNotifications" && x.UserId == employeeId, new HRMS.Shared.Application.DTOs.BaseRequest(), x => x.CreatedOn)).result;
    }
}
