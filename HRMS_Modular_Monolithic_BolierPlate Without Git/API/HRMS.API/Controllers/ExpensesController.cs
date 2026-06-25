using ExpenseFeature.Application.Repository;
using ExpenseFeature.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseRepository _repo;
        public ExpensesController(IExpenseRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? employeeId, [FromQuery] string? status)
        {
            var items = string.IsNullOrEmpty(employeeId)
                ? await _repo.GetAllAsync()
                : await _repo.GetByEmployeeIdAsync(employeeId);
            if (!string.IsNullOrEmpty(status)) items = items.Where(x => x.Status == status);
            return Ok(new { success = true, data = items.OrderByDescending(x => x.Date) });
        }

        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] SubmitExpenseDto dto)
        {
            var item = new Reimbursement
            {
                EmployeeId = dto.EmployeeId, EmployeeName = dto.EmployeeName,
                EmployeeInitials = dto.EmployeeInitials ?? "?",
                Category = dto.Category, Amount = dto.Amount, Currency = dto.Currency ?? "USD",
                Description = dto.Description, Date = dto.Date ?? DateTime.UtcNow.ToString("yyyy-MM-dd"),
                IsMileage = dto.IsMileage, MileageKm = dto.MileageKm,
                MileageFrom = dto.MileageFrom, MileageTo = dto.MileageTo, RatePerKm = dto.RatePerKm,
                IsTaxable = false, Status = "pending-approval", PolicyValid = true,
                ApprovalFlow = "[{\"approver\":\"Manager\",\"role\":\"Manager\",\"status\":\"pending\"}]",
                UserId = dto.EmployeeId
            };
            var created = await _repo.AddItemAsync(item);
            return Ok(new { success = true, data = created });
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] ApproveExpenseDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();
            existing.Status = dto.Action == "approve" ? "approved" : "rejected";
            existing.ApproverComment = dto.Comment;
            if (dto.Action == "approve") existing.PaidDate = DateTime.UtcNow.AddDays(7).ToString("yyyy-MM-dd");
            await _repo.UpdateItemAsync(id, existing);
            return Ok(new { success = true, data = existing });
        }
    }
    public record SubmitExpenseDto(string EmployeeId, string EmployeeName, string? EmployeeInitials, string Category, double Amount, string? Currency, string Description, string? Date, bool IsMileage, double? MileageKm, string? MileageFrom, string? MileageTo, double? RatePerKm);
    public record ApproveExpenseDto(string Action, string? Comment);
}
