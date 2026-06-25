using LeaveFeature.Application.Repository;
using LeaveFeature.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class LeaveController : ControllerBase
    {
        private readonly ILeaveRepository _repo;
        private readonly ILeaveBalanceRepository _balanceRepo;
        public LeaveController(ILeaveRepository repo, ILeaveBalanceRepository balanceRepo)
        {
            _repo = repo;
            _balanceRepo = balanceRepo;
        }

        [HttpGet("balances")]
        public async Task<IActionResult> GetBalances([FromQuery] string? employeeId)
        {
            var items = string.IsNullOrEmpty(employeeId)
                ? await _balanceRepo.GetAllAsync()
                : await _balanceRepo.GetByEmployeeIdAsync(employeeId);
            return Ok(new { success = true, data = items });
        }

        [HttpGet("requests")]
        public async Task<IActionResult> GetRequests([FromQuery] string? employeeId, [FromQuery] string? status)
        {
            var items = await _repo.GetAllAsync();
            if (!string.IsNullOrEmpty(employeeId)) items = items.Where(x => x.EmployeeId == employeeId);
            if (!string.IsNullOrEmpty(status)) items = items.Where(x => x.Status == status);
            return Ok(new { success = true, data = items.OrderByDescending(x => x.SubmittedDate) });
        }

        [HttpPost("requests")]
        public async Task<IActionResult> Submit([FromBody] SubmitLeaveDto dto)
        {
            var item = new LeaveRequest
            {
                EmployeeId = dto.EmployeeId, EmployeeName = dto.EmployeeName,
                EmployeeInitials = dto.EmployeeInitials ?? "?", LeaveType = dto.LeaveType,
                StartDate = dto.StartDate, EndDate = dto.EndDate, TotalDays = dto.TotalDays,
                Reason = dto.Reason, Status = "pending",
                SubmittedDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                ApprovalFlow = "[{\"approver\":\"Manager\",\"role\":\"Manager\",\"status\":\"pending\"}]",
                UserId = dto.EmployeeId
            };
            var created = await _repo.AddItemAsync(item);
            return Ok(new { success = true, data = created });
        }

        [HttpPatch("requests/{id}")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] ApproveLeaveDto dto)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();
            existing.Status = dto.Action == "approve" ? "approved" : "rejected";
            existing.ApproverComment = dto.Comment;
            existing.ApproverId = Request.Headers["X-User-Id"].ToString();
            var flow = JsonSerializer.Deserialize<List<System.Text.Json.Nodes.JsonObject>>(existing.ApprovalFlow ?? "[]") ?? new();
            if (flow.Count > 0) { flow[0]["status"] = dto.Action == "approve" ? "approved" : "rejected"; flow[0]["date"] = DateTime.UtcNow.ToString("yyyy-MM-dd"); }
            existing.ApprovalFlow = JsonSerializer.Serialize(flow);
            await _repo.UpdateItemAsync(id, existing);
            return Ok(new { success = true, data = existing });
        }
    }
    public record SubmitLeaveDto(string EmployeeId, string EmployeeName, string? EmployeeInitials, string LeaveType, string StartDate, string EndDate, int TotalDays, string Reason);
    public record ApproveLeaveDto(string Action, string? Comment);
}
