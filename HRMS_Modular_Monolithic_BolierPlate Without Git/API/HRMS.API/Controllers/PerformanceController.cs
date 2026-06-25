using PerformanceFeature.Application.Repository;
using PerformanceFeature.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/performance")]
    public class PerformanceController : ControllerBase
    {
        private readonly IPerformanceRepository _repo;
        private readonly IPerformanceReviewRepository _reviewRepo;
        private readonly IFeedbackRepository _feedbackRepo;

        public PerformanceController(
            IPerformanceRepository repo,
            IPerformanceReviewRepository reviewRepo,
            IFeedbackRepository feedbackRepo)
        {
            _repo = repo;
            _reviewRepo = reviewRepo;
            _feedbackRepo = feedbackRepo;
        }

        [HttpGet("goals")]
        public async Task<IActionResult> GetGoals([FromQuery] string? employeeId)
        {
            var items = string.IsNullOrEmpty(employeeId)
                ? await _repo.GetAllAsync()
                : await _repo.GetByEmployeeIdAsync(employeeId);
            return Ok(new { success = true, data = items });
        }

        [HttpPost("goals")]
        public async Task<IActionResult> CreateGoal([FromBody] CreateGoalDto dto)
        {
            var item = new Goal
            {
                EmployeeId = dto.EmployeeId, Title = dto.Title, Description = dto.Description ?? "",
                Category = dto.Category ?? "individual", Type = dto.Type ?? "quarterly",
                Weight = dto.Weight, DueDate = dto.DueDate, Status = "not-started", Progress = 0,
                KeyResults = dto.KeyResults != null ? JsonSerializer.Serialize(dto.KeyResults) : "[]",
                UserId = dto.EmployeeId
            };
            var created = await _repo.AddItemAsync(item);
            return Ok(new { success = true, data = created });
        }

        [HttpPatch("goals/{id}")]
        public async Task<IActionResult> UpdateGoal(string id, [FromBody] UpdateGoalDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();
            if (dto.Progress.HasValue) existing.Progress = dto.Progress.Value;
            if (!string.IsNullOrEmpty(dto.Status)) existing.Status = dto.Status;
            if (dto.KeyResults != null) existing.KeyResults = JsonSerializer.Serialize(dto.KeyResults);
            await _repo.UpdateItemAsync(id, existing);
            return Ok(new { success = true, data = existing });
        }

        [HttpGet("reviews")]
        public async Task<IActionResult> GetReviews([FromQuery] string? employeeId)
        {
            var items = string.IsNullOrEmpty(employeeId)
                ? await _reviewRepo.GetAllAsync()
                : await _reviewRepo.GetByEmployeeIdAsync(employeeId);
            return Ok(new { success = true, data = items });
        }
    }
    public record CreateGoalDto(string EmployeeId, string Title, string? Description, string? Category, string? Type, int Weight, string DueDate, object[]? KeyResults);
    public record UpdateGoalDto(int? Progress, string? Status, object[]? KeyResults);
}
