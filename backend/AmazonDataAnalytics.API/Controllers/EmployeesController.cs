using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using Microsoft.EntityFrameworkCore.Storage;

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
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    var existingEmployee = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(e => e.EmployeeId == id);
                    if (existingEmployee == null) return await Task.FromResult<IActionResult>(NotFound());
                    if (id != employee.EmployeeId)
                    {
                        // Cập nhật employee_id ở các bảng liên quan
                        await _context.Database.ExecuteSqlRawAsync("UPDATE Supervises SET employee_id = {0} WHERE employee_id = {1}", employee.EmployeeId, id);
                        await _context.Database.ExecuteSqlRawAsync("UPDATE Manages SET employee_id = {0} WHERE employee_id = {1}", employee.EmployeeId, id);
                    }
            _context.Entry(employee).State = EntityState.Modified;
            await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return await Task.FromResult<IActionResult>(NoContent());
                }
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Supervises] WHERE employee_id = {0}", id);
                        await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Manages] WHERE employee_id = {0}", id);
                        await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Employee] WHERE employee_id = {0}", id);
                        await transaction.CommitAsync();
            return NoContent();
                    }
                    catch
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                }
            });
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