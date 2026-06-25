using OnboardingFeature.Application.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class OnboardingController : ControllerBase
    {
        private readonly IOnboardingRepository _repo;
        public OnboardingController(IOnboardingRepository repo) => _repo = repo;

        [HttpGet("{employeeId}")]
        public async Task<IActionResult> Get(string employeeId)
        {
            var item = await _repo.GetItemAsync(x => x.EmployeeId == employeeId || x.UserId == employeeId);
            if (item == null)
            {
                var all = await _repo.GetAllAsync();
                item = all.FirstOrDefault();
            }
            return item == null ? NotFound() : Ok(new { success = true, data = item });
        }

        [HttpPatch("tasks/{taskId}")]
        public async Task<IActionResult> CompleteTask(string taskId, [FromBody] CompleteTaskDto dto)
        {
            var all = await _repo.GetAllAsync();
            var onboarding = all.FirstOrDefault();
            if (onboarding == null) return NotFound();

            var tasks = JsonSerializer.Deserialize<List<JsonObject>>(onboarding.Tasks ?? "[]") ?? new();
            var task = tasks.FirstOrDefault(t => t["id"]?.ToString() == taskId);
            if (task != null)
            {
                task["status"] = dto.Status ?? "completed";
                if (dto.Status == "completed") task["completedDate"] = DateTime.UtcNow.ToString("yyyy-MM-dd");
            }
            onboarding.Tasks = JsonSerializer.Serialize(tasks);

            var completed = tasks.Count(t => t["status"]?.ToString() == "completed");
            onboarding.ProgressPercent = tasks.Count > 0 ? (int)Math.Round((double)completed / tasks.Count * 100) : 0;

            await _repo.UpdateItemAsync(onboarding.Id, onboarding);
            return Ok(new { success = true, data = onboarding });
        }

        [HttpPost("{employeeId}/complete")]
        public async Task<IActionResult> CompleteOnboarding(string employeeId)
        {
            var item = await _repo.GetItemAsync(x => x.EmployeeId == employeeId);
            if (item == null) return NotFound();
            item.IsComplete = true;
            item.ProgressPercent = 100;
            await _repo.UpdateItemAsync(item.Id, item);
            return Ok(new { success = true });
        }
    }
    public record CompleteTaskDto(string? Status);
}
