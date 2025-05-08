using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ApplicationDbContext context, ILogger<CustomersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _context.Customers.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = customer.CustomerId }, customer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Customer customer)
    {
        if (id != customer.CustomerId) return BadRequest();
        var strategy = _context.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                var existingCustomer = await _context.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.CustomerId == id);
                if (existingCustomer == null) return await Task.FromResult<IActionResult>(NotFound());
                if (id != customer.CustomerId)
                {
                    // Cập nhật customer_id ở các bảng liên quan
                    await _context.Database.ExecuteSqlRawAsync("UPDATE [Order] SET customer_id = {0} WHERE customer_id = {1}", customer.CustomerId, id);
                }
                _context.Entry(customer).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return await Task.FromResult<IActionResult>(NoContent());
            }
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var warehouse = await _context.Warehouses.FindAsync(id);
        if (warehouse == null)
            return await Task.FromResult<IActionResult>(NotFound($"Warehouse with ID {id} not found"));
        var strategy = _context.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Stores] WHERE warehouse_id = {0}", id);
                    await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Supervises] WHERE warehouse_id = {0}", id);
                    await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Warehouse] WHERE warehouse_id = {0}", id);
                    await transaction.CommitAsync();
                    return await Task.FromResult<IActionResult>(NoContent());
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error occurred while deleting warehouse with ID {id}");
                    await transaction.RollbackAsync();
                    return await Task.FromResult<IActionResult>(StatusCode(500, $"Error: {ex.Message}"));
                }
            }
        });
    }

    [HttpGet("filter")]
    public async Task<IActionResult> Filter([FromQuery] string? name, [FromQuery] string? email, [FromQuery] string? district)
    {
        var query = _context.Customers.AsQueryable();
        if (!string.IsNullOrEmpty(name))
            query = query.Where(c => c.CustomerName.Contains(name));
        if (!string.IsNullOrEmpty(email))
            query = query.Where(c => c.Email.Contains(email));
        if (!string.IsNullOrEmpty(district))
            query = query.Where(c => c.District == district);
        var result = await query.ToListAsync();
        return Ok(result);
    }
} 