using AttendanceFeature.Application.Repository;
using AttendanceFeature.Domain;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceRepository _repo;
        public AttendanceController(IAttendanceRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? employeeId)
        {
            var records = string.IsNullOrEmpty(employeeId)
                ? await _repo.GetAllAsync()
                : await _repo.GetByEmployeeIdAsync(employeeId);
            return Ok(new { success = true, data = records.OrderByDescending(r => r.Date) });
        }

        [HttpPost("clockin")]
        public async Task<IActionResult> ClockIn([FromBody] ClockInDto dto)
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var existing = await _repo.GetItemAsync(x => x.UserId == dto.EmployeeId && x.Date == today);
            var record = existing ?? new AttendanceRecord
            {
                EmployeeId = dto.EmployeeId, Date = today, Status = "present",
                UserId = dto.EmployeeId,
                LocationVerified = true, IpValidated = true, ShiftName = "General Shift"
            };
            record.ClockIn = DateTime.UtcNow.ToString("HH:mm");
            record.ClockMethod = dto.Method ?? "selfie";
            if (existing == null) await _repo.AddItemAsync(record);
            else await _repo.UpdateItemAsync(record.Id, record);
            return Ok(new { success = true, data = record });
        }

        [HttpPost("clockout")]
        public async Task<IActionResult> ClockOut([FromBody] ClockOutDto dto)
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var record = await _repo.GetItemAsync(x => x.UserId == dto.EmployeeId && x.Date == today);
            if (record == null) return NotFound();
            record.ClockOut = DateTime.UtcNow.ToString("HH:mm");
            if (record.ClockIn != null)
            {
                var start = TimeSpan.Parse(record.ClockIn);
                var end = TimeSpan.Parse(record.ClockOut);
                var total = (end - start).TotalHours;
                record.TotalHours = Math.Round(total, 2);
                record.ProductiveHours = Math.Round(total - 0.5, 2);
                record.BreakHours = 0.5;
                record.OvertimeHours = total > 9 ? Math.Round(total - 9, 2) : 0;
            }
            await _repo.UpdateItemAsync(record.Id, record);
            return Ok(new { success = true, data = record });
        }
    }
    public record ClockInDto(string EmployeeId, string? Method);
    public record ClockOutDto(string EmployeeId);
}
