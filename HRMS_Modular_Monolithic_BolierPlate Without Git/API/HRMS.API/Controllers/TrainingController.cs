using TrainingFeature.Application.Repository;
using TrainingFeature.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class TrainingController : ControllerBase
    {
        private readonly ITrainingRepository _repo;
        public TrainingController(ITrainingRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? employeeId)
        {
            var items = string.IsNullOrEmpty(employeeId)
                ? await _repo.GetAllAsync()
                : await _repo.GetByEmployeeIdAsync(employeeId);
            return Ok(new { success = true, data = items });
        }

        [HttpPatch("{id}/progress")]
        public async Task<IActionResult> UpdateProgress(string id, [FromBody] UpdateProgressDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();

            var contents = JsonSerializer.Deserialize<List<System.Text.Json.Nodes.JsonObject>>(existing.Contents ?? "[]") ?? new();
            foreach (var c in contents)
            {
                if (c["id"]?.ToString() == dto.ContentId) c["completed"] = dto.Completed;
            }
            existing.Contents = JsonSerializer.Serialize(contents);

            var completed = contents.Count(c => c["completed"]?.ToString() == "True" || c["completed"]?.ToString() == "true");
            existing.Progress = contents.Count > 0 ? (int)Math.Round((double)completed / contents.Count * 100) : 0;
            existing.Status = existing.Progress == 100 ? "completed" : existing.Progress > 0 ? "in-progress" : "not-started";

            if (existing.Progress == 100 && existing.IsCertificateEligible && string.IsNullOrEmpty(existing.CertificateId))
                existing.CertificateId = $"CERT-{existing.Id[..8].ToUpper()}-{DateTime.UtcNow.Year}";

            await _repo.UpdateItemAsync(id, existing);
            return Ok(new { success = true, data = existing });
        }
    }
    public record UpdateProgressDto(string ContentId, bool Completed);
}
