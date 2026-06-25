using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;
namespace NotificationFeature.Domain
{
    public class HrmsNotification : BaseEntity
    {
        public string Type { get; set; } = "general";
        public string Message { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty;
        public bool Read { get; set; }
        public string Href { get; set; } = "/";
        public string Icon { get; set; } = "bell";
        public string ForRoles { get; set; } = "[]"; // JSON array
        public string? ForEmployeeId { get; set; }
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
