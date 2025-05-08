using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SuppliersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Suppliers.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null) return NotFound();
            return Ok(supplier);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Supplier supplier)
        {
            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = supplier.SupplierId }, supplier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Supplier supplier)
        {
            if (id != supplier.SupplierId) return BadRequest();
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    var existingSupplier = await _context.Suppliers.AsNoTracking().FirstOrDefaultAsync(s => s.SupplierId == id);
                    if (existingSupplier == null) return await Task.FromResult<IActionResult>(NotFound());
                    if (id != supplier.SupplierId)
                    {
                        // Cập nhật supplier_id ở các bảng liên quan
                        await _context.Database.ExecuteSqlRawAsync("UPDATE Supplies SET supplier_id = {0} WHERE supplier_id = {1}", supplier.SupplierId, id);
                    }
                    _context.Entry(supplier).State = EntityState.Modified;
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
                        await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Supplies] WHERE supplier_id = {0}", id);
                        await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Supplier] WHERE supplier_id = {0}", id);
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
        public async Task<IActionResult> Filter([FromQuery] string? companyName, [FromQuery] string? representativeName, [FromQuery] string? email)
        {
            var query = _context.Suppliers.AsQueryable();
            if (!string.IsNullOrEmpty(companyName))
                query = query.Where(s => s.CompanyName.Contains(companyName));
            if (!string.IsNullOrEmpty(representativeName))
                query = query.Where(s => s.RepresentativeName.Contains(representativeName));
            if (!string.IsNullOrEmpty(email))
                query = query.Where(s => s.Email.Contains(email));
            var result = await query.ToListAsync();
            return Ok(result);
        }
    }
} 