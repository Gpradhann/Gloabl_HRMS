using RecognitionFeature.Application.Repository;
using RecognitionFeature.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class RecognitionController : ControllerBase
    {
        private readonly IRecognitionRepository _repo;
        public RecognitionController(IRecognitionRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var items = await _repo.GetAllAsync();
            return Ok(new { success = true, data = items.OrderByDescending(x => x.Date) });
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PostRecognitionDto dto)
        {
            var item = new Recognition
            {
                FromEmployeeId = dto.FromEmployeeId, FromEmployeeName = dto.FromEmployeeName,
                FromEmployeeInitials = dto.FromEmployeeInitials ?? "?",
                ToEmployeeId = dto.ToEmployeeId, ToEmployeeName = dto.ToEmployeeName,
                ToEmployeeInitials = dto.ToEmployeeInitials ?? "?",
                Category = dto.Category, Message = dto.Message, IsPublic = dto.IsPublic ?? true,
                LikesCount = 0, CommentsCount = 0,
                Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                FromColor = dto.FromColor ?? "#0d9488", ToColor = dto.ToColor ?? "#8b5cf6",
                LikedBy = "[]", UserId = dto.FromEmployeeId
            };
            var created = await _repo.AddItemAsync(item);
            return Ok(new { success = true, data = created });
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> Like(string id, [FromBody] LikeRecognitionDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();
            var likedBy = JsonSerializer.Deserialize<List<string>>(existing.LikedBy ?? "[]") ?? new();
            bool isLiked;
            if (likedBy.Contains(dto.EmployeeId)) { likedBy.Remove(dto.EmployeeId); isLiked = false; }
            else { likedBy.Add(dto.EmployeeId); isLiked = true; }
            existing.LikedBy = JsonSerializer.Serialize(likedBy);
            existing.LikesCount = likedBy.Count;
            await _repo.UpdateItemAsync(id, existing);
            return Ok(new { success = true, liked = isLiked, likesCount = existing.LikesCount });
        }
    }
    public record PostRecognitionDto(string FromEmployeeId, string FromEmployeeName, string? FromEmployeeInitials, string ToEmployeeId, string ToEmployeeName, string? ToEmployeeInitials, string Category, string Message, bool? IsPublic, string? FromColor, string? ToColor);
    public record LikeRecognitionDto(string EmployeeId);
}
