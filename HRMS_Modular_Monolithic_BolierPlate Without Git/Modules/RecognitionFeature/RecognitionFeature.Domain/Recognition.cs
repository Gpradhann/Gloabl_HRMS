using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;
namespace RecognitionFeature.Domain
{
    public class Recognition : BaseEntity
    {
        public string FromEmployeeId { get; set; } = string.Empty;
        public string FromEmployeeName { get; set; } = string.Empty;
        public string FromEmployeeInitials { get; set; } = string.Empty;
        public string ToEmployeeId { get; set; } = string.Empty;
        public string ToEmployeeName { get; set; } = string.Empty;
        public string ToEmployeeInitials { get; set; } = string.Empty;
        public string Category { get; set; } = "excellence";
        public string Message { get; set; } = string.Empty;
        public bool IsPublic { get; set; } = true;
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
        public string Date { get; set; } = string.Empty;
        public string FromColor { get; set; } = "#0d9488";
        public string ToColor { get; set; } = "#8b5cf6";
        public string LikedBy { get; set; } = "[]"; // JSON array of employeeIds
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
