using PayrollFeature.Application.Repository;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController][Route("api/[controller]")]
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollRepository _repo;
        public PayrollController(IPayrollRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? employeeId)
        {
            var items = string.IsNullOrEmpty(employeeId)
                ? await _repo.GetAllAsync()
                : await _repo.GetByEmployeeIdAsync(employeeId);
            return Ok(new { success = true, data = items.OrderByDescending(x => x.PayDate) });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var item = await _repo.GetItemAsync(x => x.Id == id);
            return item == null ? NotFound() : Ok(new { success = true, data = item });
        }
    }
}
