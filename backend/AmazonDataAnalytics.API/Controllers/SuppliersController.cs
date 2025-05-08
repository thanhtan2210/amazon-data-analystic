using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;

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
            _context.Entry(supplier).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var supplies = _context.Supplies.Where(s => s.SupplierId == id);
            _context.Supplies.RemoveRange(supplies);

            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null) return NotFound();
            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();
            return NoContent();
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