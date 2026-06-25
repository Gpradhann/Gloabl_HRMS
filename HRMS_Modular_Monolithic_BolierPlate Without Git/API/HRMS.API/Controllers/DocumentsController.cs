using DocumentFeature.Application.Repository;
using DocumentFeature.Domain;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentRepository _repo;
        public DocumentsController(IDocumentRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? employeeId)
        {
            var items = string.IsNullOrEmpty(employeeId)
                ? await _repo.GetAllAsync()
                : await _repo.GetByEmployeeIdAsync(employeeId);
            return Ok(new { success = true, data = items });
        }

        [HttpPost]
        public async Task<IActionResult> Upload([FromBody] UploadDocumentDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.EmployeeId == dto.EmployeeId && x.Name == dto.Name);
            if (existing != null)
            {
                existing.Status = "uploaded";
                existing.FileName = dto.FileName;
                existing.UploadDate = DateTime.UtcNow.ToString("yyyy-MM-dd");
                await _repo.UpdateItemAsync(existing.Id, existing);
                return Ok(new { success = true, data = existing });
            }
            var item = new HrmsDocument
            {
                EmployeeId = dto.EmployeeId, Name = dto.Name, Category = dto.Category ?? "other",
                Status = "uploaded", FileName = dto.FileName, FileSize = dto.FileSize,
                FileType = dto.FileType, UploadDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                IsRequired = dto.IsRequired ?? false,
                UserId = dto.EmployeeId
            };
            var created = await _repo.AddItemAsync(item);
            return Ok(new { success = true, data = created });
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateDocumentDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();
            existing.Status = dto.Action == "verify" ? "verified" : "rejected";
            if (dto.Action == "verify") existing.VerifiedDate = DateTime.UtcNow.ToString("yyyy-MM-dd");
            if (dto.Action == "reject") existing.RejectionReason = dto.Reason;
            await _repo.UpdateItemAsync(id, existing);
            return Ok(new { success = true, data = existing });
        }
    }
    public record UploadDocumentDto(string EmployeeId, string Name, string? Category, string? FileName, long? FileSize, string? FileType, bool? IsRequired);
    public record UpdateDocumentDto(string Action, string? Reason);
}
