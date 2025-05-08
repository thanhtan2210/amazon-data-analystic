using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarehousesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<WarehousesController> _logger;

        public WarehousesController(ApplicationDbContext context, ILogger<WarehousesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Warehouses.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var warehouse = await _context.Warehouses.FindAsync(id);
            if (warehouse == null) return NotFound();
            return Ok(warehouse);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Warehouse warehouse)
        {
            _context.Warehouses.Add(warehouse);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = warehouse.WarehouseId }, warehouse);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Warehouse warehouse)
        {
            if (id != warehouse.WarehouseId) return BadRequest();
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    var existingWarehouse = await _context.Warehouses.AsNoTracking().FirstOrDefaultAsync(w => w.WarehouseId == id);
                    if (existingWarehouse == null) return await Task.FromResult<IActionResult>(NotFound());
                    if (id != warehouse.WarehouseId)
                    {
                        await _context.Database.ExecuteSqlRawAsync("UPDATE Stores SET warehouse_id = {0} WHERE warehouse_id = {1}", warehouse.WarehouseId, id);
                        await _context.Database.ExecuteSqlRawAsync("UPDATE Supervises SET warehouse_id = {0} WHERE warehouse_id = {1}", warehouse.WarehouseId, id);
                    }
                    _context.Entry(warehouse).State = EntityState.Modified;
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
            if (warehouse == null) return NotFound();
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
        public async Task<IActionResult> Filter(
            [FromQuery] string? name,
            [FromQuery] string? status,
            [FromQuery] decimal? minArea,
            [FromQuery] decimal? maxArea,
            [FromQuery] decimal? minCapacity,
            [FromQuery] decimal? maxCapacity)
        {
            var query = _context.Warehouses.AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(w => w.WarehouseName.Contains(name));

            if (!string.IsNullOrEmpty(status))
                query = query.Where(w => w.Status == status);

            if (minArea.HasValue)
                query = query.Where(w => w.Area >= minArea.Value);

            if (maxArea.HasValue)
                query = query.Where(w => w.Area <= maxArea.Value);

            if (minCapacity.HasValue)
                query = query.Where(w => w.Capacity >= minCapacity.Value);

            if (maxCapacity.HasValue)
                query = query.Where(w => w.Capacity <= maxCapacity.Value);

            var result = await query.ToListAsync();
            return Ok(result);
        }
    }
} 