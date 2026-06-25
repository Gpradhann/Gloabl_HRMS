using ContributionFeature.Application.Repository;
using ContributionFeature.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class ContributionsController : ControllerBase
    {
        private readonly IContributionRepository _repo;
        private readonly IContributionItemRepository _itemRepo;
        private readonly IContributionLeaderboardRepository _leaderboardRepo;

        public ContributionsController(
            IContributionRepository repo,
            IContributionItemRepository itemRepo,
            IContributionLeaderboardRepository leaderboardRepo)
        {
            _repo = repo;
            _itemRepo = itemRepo;
            _leaderboardRepo = leaderboardRepo;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? employeeId)
        {
            var items = string.IsNullOrEmpty(employeeId)
                ? await _repo.GetAllAsync()
                : await _repo.GetByEmployeeIdAsync(employeeId);
            return Ok(new { success = true, data = items.OrderByDescending(x => x.CreatedDate) });
        }

        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] SubmitContributionDto dto)
        {
            var item = new ValueContribution
            {
                EmployeeId = dto.EmployeeId, EmployeeName = dto.EmployeeName,
                EmployeeInitials = dto.EmployeeInitials ?? "?",
                Title = dto.Title, Description = dto.Description, Type = dto.Type ?? "self-initiated",
                Category = dto.Category ?? "innovation", SuggestedPoints = dto.SuggestedPoints,
                ImpactLevel = dto.ImpactLevel ?? "medium",
                Tags = dto.Tags != null ? JsonSerializer.Serialize(dto.Tags) : "[]",
                Status = "proposal-pending",
                ApprovalFlow = "[{\"approver\":\"Manager\",\"role\":\"Manager\",\"status\":\"pending\"}]",
                CreatedDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                UserId = dto.EmployeeId
            };
            var created = await _repo.AddItemAsync(item);
            return Ok(new { success = true, data = created });
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Approve(string id, [FromBody] ApproveContributionDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();
            existing.Status = dto.Action == "approve" ? "completed" : "rejected";
            if (dto.FinalPoints.HasValue) existing.FinalPoints = dto.FinalPoints;
            await _repo.UpdateItemAsync(id, existing);
            return Ok(new { success = true, data = existing });
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard()
        {
            var items = await _leaderboardRepo.GetAllAsync();
            return Ok(new { success = true, data = items });
        }

        [HttpGet("items")]
        public async Task<IActionResult> GetItems()
        {
            var items = await _itemRepo.GetAllAsync();
            return Ok(new { success = true, data = items });
        }

        [HttpPost("items/{id}/claim")]
        public async Task<IActionResult> ClaimItem(string id, [FromQuery] string employeeId)
        {
            var item = await _itemRepo.GetItemAsync(x => x.Id == id);
            if (item == null) return NotFound();
            item.IsAvailable = false;
            item.ClaimedBy = employeeId;
            await _itemRepo.UpdateItemAsync(id, item);
            return Ok(new { success = true, data = item });
        }
    }
    public record SubmitContributionDto(string EmployeeId, string EmployeeName, string? EmployeeInitials, string Title, string Description, string? Type, string? Category, int SuggestedPoints, string? ImpactLevel, string[]? Tags);
    public record ApproveContributionDto(string Action, int? FinalPoints, string? Comment);
}
