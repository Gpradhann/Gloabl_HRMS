using AnnouncementFeature.Application.Repository;
using AnnouncementFeature.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementRepository _repo;
        private readonly ILogger<AnnouncementsController> _logger;

        public AnnouncementsController(IAnnouncementRepository repo, ILogger<AnnouncementsController> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? userRole, [FromQuery] string? employeeId)
        {
            var items = await _repo.GetAllAsync();
            return Ok(new { success = true, data = items });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAnnouncementDto dto)
        {
            var userRole = Request.Headers["X-User-Role"].ToString();
            if (userRole != "HR" && userRole != "Admin")
                return Forbid();

            var item = new Announcement
            {
                Title = dto.Title,
                Content = dto.Content,
                Category = dto.Category,
                Priority = dto.Priority,
                VisibilityScope = dto.VisibilityScope ?? "global",
                TargetDepartments = dto.TargetDepartments != null ? JsonSerializer.Serialize(dto.TargetDepartments) : null,
                RequiresAcknowledgment = dto.RequiresAcknowledgment,
                PublishedDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                PublishedBy = dto.PublishedBy ?? $"{userRole} User",
                Views = 0, Likes = 0, Acknowledgments = 0, Comments = 0,
                AcknowledgedBy = "[]", LikedBy = "[]",
                UserId = Request.Headers["X-User-Id"].ToString()
            };

            var created = await _repo.AddItemAsync(item);
            return Ok(new { success = true, data = created });
        }

        [HttpPost("{id}/acknowledge")]
        public async Task<IActionResult> Acknowledge(string id, [FromBody] AcknowledgeDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();

            var likedBy = JsonSerializer.Deserialize<List<string>>(existing.AcknowledgedBy ?? "[]") ?? new();
            if (!likedBy.Contains(dto.EmployeeId))
            {
                likedBy.Add(dto.EmployeeId);
                existing.AcknowledgedBy = JsonSerializer.Serialize(likedBy);
                existing.Acknowledgments = likedBy.Count;
                await _repo.UpdateItemAsync(id, existing);
            }
            return Ok(new { success = true, acknowledged = true });
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> Like(string id, [FromBody] LikeDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();

            var likedBy = JsonSerializer.Deserialize<List<string>>(existing.LikedBy ?? "[]") ?? new();
            bool isLiked;
            if (likedBy.Contains(dto.EmployeeId)) { likedBy.Remove(dto.EmployeeId); isLiked = false; }
            else { likedBy.Add(dto.EmployeeId); isLiked = true; }

            existing.LikedBy = JsonSerializer.Serialize(likedBy);
            existing.Likes = likedBy.Count;
            await _repo.UpdateItemAsync(id, existing);

            return Ok(new { success = true, liked = isLiked, likesCount = existing.Likes });
        }
    }

    public record CreateAnnouncementDto(
        string Title, string Content, string Category, string Priority,
        string? VisibilityScope, string[]? TargetDepartments, bool RequiresAcknowledgment, string? PublishedBy,
        string? ExpiryDate
    );
    public record AcknowledgeDto(string EmployeeId);
    public record LikeDto(string EmployeeId);
}
