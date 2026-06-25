using RecruitmentFeature.Application.Repository;
using RecruitmentFeature.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/recruitment")]
    public class RecruitmentController : ControllerBase
    {
        private readonly IRecruitmentRepository _repo;
        private readonly IJobPostingRepository _jobRepo;
        public RecruitmentController(IRecruitmentRepository repo, IJobPostingRepository jobRepo)
        {
            _repo = repo;
            _jobRepo = jobRepo;
        }

        [HttpGet("jobs")]
        public async Task<IActionResult> GetJobs()
        {
            var items = await _jobRepo.GetAllAsync();
            return Ok(new { success = true, data = items });
        }

        [HttpGet("candidates")]
        public async Task<IActionResult> GetCandidates([FromQuery] string? jobId, [FromQuery] string? status)
        {
            var items = await _repo.GetAllAsync();
            if (!string.IsNullOrEmpty(jobId)) items = items.Where(x => x.JobPostingId == jobId);
            if (!string.IsNullOrEmpty(status)) items = items.Where(x => x.Status == status);
            return Ok(new { success = true, data = items.OrderByDescending(x => x.AppliedDate) });
        }

        [HttpPost("candidates")]
        public async Task<IActionResult> AddCandidate([FromBody] AddCandidateDto dto)
        {
            var item = new Candidate
            {
                JobPostingId = dto.JobPostingId, Name = dto.Name, Email = dto.Email,
                Phone = dto.Phone ?? "", Initials = dto.Initials ?? dto.Name[..2].ToUpper(),
                AppliedRole = dto.AppliedRole, Skills = dto.Skills != null ? JsonSerializer.Serialize(dto.Skills) : "[]",
                ExperienceYears = dto.ExperienceYears, ExpectedSalary = dto.ExpectedSalary,
                Currency = dto.Currency ?? "USD", NoticePeriodDays = dto.NoticePeriodDays,
                Rating = dto.Rating ?? 3.0, Notes = dto.Notes ?? "",
                Status = "new", AppliedDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                Color = "#0d9488", UserId = dto.JobPostingId
            };
            var created = await _repo.AddItemAsync(item);
            return Ok(new { success = true, data = created });
        }

        [HttpPatch("candidates/{id}")]
        public async Task<IActionResult> UpdateCandidate(string id, [FromBody] UpdateCandidateDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();
            if (!string.IsNullOrEmpty(dto.Status)) existing.Status = dto.Status;
            if (!string.IsNullOrEmpty(dto.InterviewDate)) existing.InterviewDate = dto.InterviewDate;
            if (!string.IsNullOrEmpty(dto.Notes)) existing.Notes = dto.Notes;
            if (dto.Rating.HasValue) existing.Rating = dto.Rating.Value;
            await _repo.UpdateItemAsync(id, existing);
            return Ok(new { success = true, data = existing });
        }
    }
    public record AddCandidateDto(string JobPostingId, string Name, string Email, string? Phone, string? Initials, string AppliedRole, string[]? Skills, int ExperienceYears, double ExpectedSalary, string? Currency, int NoticePeriodDays, double? Rating, string? Notes);
    public record UpdateCandidateDto(string? Status, string? InterviewDate, string? Notes, double? Rating);
}
