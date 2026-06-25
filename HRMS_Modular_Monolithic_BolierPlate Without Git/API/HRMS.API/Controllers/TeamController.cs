using EmployeeFeature.Application.Repository;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;
        public TeamController(IEmployeeRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? managerId)
        {
            var items = await _repo.GetAllAsync();
            if (!string.IsNullOrEmpty(managerId))
                items = items.Where(x => x.ManagerId == managerId);
            return Ok(new { success = true, data = items });
        }
    }
}
