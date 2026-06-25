using NotificationFeature.Application.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationRepository _repo;
        public NotificationsController(INotificationRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? userRole)
        {
            var items = await _repo.GetAllAsync();
            if (!string.IsNullOrEmpty(userRole))
                items = items.Where(n => {
                    var roles = JsonSerializer.Deserialize<List<string>>(n.ForRoles ?? "[]") ?? new();
                    return roles.Contains(userRole);
                });
            return Ok(new { success = true, data = items.OrderByDescending(x => x.Timestamp) });
        }

        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllRead([FromQuery] string? userRole)
        {
            var items = await _repo.GetAllAsync();
            foreach (var n in items.Where(n => !n.Read))
            {
                n.Read = true;
                await _repo.UpdateItemAsync(n.Id, n);
            }
            return Ok(new { success = true, message = "All notifications marked as read" });
        }

        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkRead(string id)
        {
            var existing = await _repo.GetItemAsync(x => x.Id == id);
            if (existing == null) return NotFound();
            existing.Read = true;
            await _repo.UpdateItemAsync(id, existing);
            return Ok(new { success = true });
        }
    }
}
