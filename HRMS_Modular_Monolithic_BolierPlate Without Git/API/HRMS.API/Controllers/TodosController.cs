using MediatR;
using Microsoft.AspNetCore.Mvc;
using TodoFeature.Application.DTO;
using HRMS.Core.Postgres.Common;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodosController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TodosController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? userId,
            [FromQuery] bool? isCompleted,
            [FromQuery] string? keyword,
            [FromQuery] int? skip,
            [FromQuery] int? pageSize)
        {
            var request = new GetAllTodosRequest
            {
                RequestParam = new GetAllTodosDto
                {
                    UserId = userId,
                    IsCompleted = isCompleted,
                    Keyword = keyword
                },
                PageCriteria = new PageCriteria
                {
                    EnablePage = skip.HasValue || pageSize.HasValue,
                    Skip = skip ?? 0,
                    PageSize = pageSize ?? 10
                }
            };
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTodoDto dto)
        {
            var request = new CreateTodoRequest
            {
                RequestParam = dto
            };
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateTodoDto dto)
        {
            dto.TodoId = id;
            var request = new UpdateTodoRequest
            {
                RequestParam = dto
            };
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var request = new DeleteTodoRequest
            {
                RequestParam = new DeleteTodoDto
                {
                    TodoId = id
                }
            };
            var result = await _mediator.Send(request);
            return Ok(result);
        }
    }
}
