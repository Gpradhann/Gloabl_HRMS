using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;
namespace AnnouncementFeature.Domain
{
    public class Announcement : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = "general";
        public string Priority { get; set; } = "medium";
        public string VisibilityScope { get; set; } = "global";
        public string? TargetDepartments { get; set; } // JSON
        public string? TargetLocations { get; set; } // JSON
        public string? Attachments { get; set; } // JSON
        public string? ExpiryDate { get; set; }
        public string PublishedDate { get; set; } = string.Empty;
        public string PublishedBy { get; set; } = string.Empty;
        public int Views { get; set; }
        public int Likes { get; set; }
        public int Acknowledgments { get; set; }
        public int Comments { get; set; }
        public bool RequiresAcknowledgment { get; set; }
        public string AcknowledgedBy { get; set; } = "[]"; // JSON array of employeeIds
        public string LikedBy { get; set; } = "[]"; // JSON array of employeeIds
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
