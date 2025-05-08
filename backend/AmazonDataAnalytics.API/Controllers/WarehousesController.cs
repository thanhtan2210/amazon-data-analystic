using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using System.ComponentModel.DataAnnotations;

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
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                if (page < 1 || pageSize < 1)
                    return BadRequest("Page and pageSize must be greater than 0");

                var query = _context.Warehouses.AsQueryable();
                var total = await query.CountAsync();
                var data = await query
                    .OrderBy(e => e.WarehouseId)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { data, total, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all warehouses");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var warehouse = await _context.Warehouses.FindAsync(id);
                if (warehouse == null) return NotFound($"Warehouse with ID {id} not found");
                return Ok(warehouse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting warehouse with ID {id}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Warehouse warehouse)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                _context.Warehouses.Add(warehouse);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(Get), new { id = warehouse.WarehouseId }, warehouse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating warehouse");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Warehouse warehouse)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (id != warehouse.WarehouseId)
                    return BadRequest("ID mismatch");

                var existingWarehouse = await _context.Warehouses.FindAsync(id);
                if (existingWarehouse == null)
                    return NotFound($"Warehouse with ID {id} not found");

                _context.Entry(existingWarehouse).CurrentValues.SetValues(warehouse);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating warehouse with ID {id}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var warehouse = await _context.Warehouses.FindAsync(id);
                if (warehouse == null)
                    return NotFound($"Warehouse with ID {id} not found");

                // Delete related records
                var stores = await _context.Stores.Where(s => s.WarehouseId == id).ToListAsync();
                _context.Stores.RemoveRange(stores);

                // Remove Supervises records
                var supervises = await _context.Supervises.Where(s => s.WarehouseId == id).ToListAsync();
                _context.Supervises.RemoveRange(supervises);

                _context.Warehouses.Remove(warehouse);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting warehouse with ID {id}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter(
            [FromQuery] string? status,
            [FromQuery] decimal? minArea,
            [FromQuery] decimal? maxArea,
            [FromQuery] decimal? minCapacity,
            [FromQuery] decimal? maxCapacity)
        {
            try
            {
                var query = _context.Warehouses.AsQueryable();

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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while filtering warehouses");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }
    }
} 