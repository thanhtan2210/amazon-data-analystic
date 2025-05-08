using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public EmployeesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var query = _context.Employees.AsQueryable();
            var total = await query.CountAsync();
            var data = await query
                .OrderBy(e => e.EmployeeId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return Ok(new { data, total });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = employee.EmployeeId }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Employee employee)
        {
            if (id != employee.EmployeeId) return BadRequest();
            _context.Entry(employee).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound();
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter([FromQuery] string? department, [FromQuery] string? role, [FromQuery] decimal? minSalary, [FromQuery] decimal? maxSalary)
        {
            var query = _context.Employees.AsQueryable();
            if (!string.IsNullOrEmpty(department))
                query = query.Where(e => e.Department == department);
            if (!string.IsNullOrEmpty(role))
                query = query.Where(e => e.Role == role);
            if (minSalary.HasValue)
                query = query.Where(e => e.Salary >= minSalary.Value);
            if (maxSalary.HasValue)
                query = query.Where(e => e.Salary <= maxSalary.Value);
            var result = await query.ToListAsync();
            return Ok(result);
        }
    }
} 