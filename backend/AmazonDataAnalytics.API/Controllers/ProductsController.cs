using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var query = _context.Products.AsQueryable();
            var total = await query.CountAsync();
            var data = await query
                .OrderBy(e => e.ProductId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return Ok(new { data, total });
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // POST: api/Products
        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = product.ProductId }, product);
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product product)
        {
            if (id != product.ProductId) return BadRequest();
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Xóa các bản ghi liên quan trong bảng Contains trước
            var contains = _context.Contains.Where(c => c.ProductId == id);
            _context.Contains.RemoveRange(contains);

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter([FromQuery] string? category, [FromQuery] string? brand, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
        {
            var query = _context.Products.AsQueryable();
            if (!string.IsNullOrEmpty(category))
                query = query.Where(p => p.Category == category);
            if (!string.IsNullOrEmpty(brand))
                query = query.Where(p => p.Brand == brand);
            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);
            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);
            var result = await query.ToListAsync();
            return Ok(result);
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
} 