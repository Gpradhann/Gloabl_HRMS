using EmployeeFeature.Application.Repository;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;
        public EmployeesController(IEmployeeRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? department, [FromQuery] string? managerId)
        {
            var items = await _repo.GetAllAsync();
            if (!string.IsNullOrEmpty(department)) items = items.Where(x => x.Department == department);
            if (!string.IsNullOrEmpty(managerId)) items = items.Where(x => x.ManagerId == managerId);
            return Ok(new { success = true, data = items });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var item = await _repo.GetItemAsync(x => x.Id == id);
            return item == null ? NotFound() : Ok(new { success = true, data = item });
        }

        [HttpGet("team")]
        public async Task<IActionResult> GetTeam([FromQuery] string? managerId)
        {
            var items = await _repo.GetAllAsync();
            if (!string.IsNullOrEmpty(managerId))
                items = items.Where(x => x.ManagerId == managerId);
            return Ok(new { success = true, data = items });
        }
    }
}
