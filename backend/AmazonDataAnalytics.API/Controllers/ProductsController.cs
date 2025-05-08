using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore.Storage;

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
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    // Nếu productId thay đổi (hiếm gặp), cập nhật các bảng liên quan
                    var existingProduct = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.ProductId == id);
                    if (existingProduct == null) return await Task.FromResult<IActionResult>(NotFound());
                    if (id != product.ProductId)
                    {
                        // Cập nhật product_id ở các bảng liên quan
                        await _context.Database.ExecuteSqlRawAsync("UPDATE [Contains] SET product_id = {0} WHERE product_id = {1}", product.ProductId, id);
                        await _context.Database.ExecuteSqlRawAsync("UPDATE Stores SET product_id = {0} WHERE product_id = {1}", product.ProductId, id);
                        await _context.Database.ExecuteSqlRawAsync("UPDATE Supplies SET product_id = {0} WHERE product_id = {1}", product.ProductId, id);
                    }
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return await Task.FromResult<IActionResult>(NoContent());
                }
            });
        }

        // DELETE: api/Products/5
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
                        // Xóa các bản ghi liên quan trong bảng Contains
                        await _context.Database.ExecuteSqlRawAsync(
                            "DELETE FROM [Contains] WHERE product_id = {0}", id);

                        // Xóa các bản ghi liên quan trong bảng Stores
                        await _context.Database.ExecuteSqlRawAsync(
                            "DELETE FROM [Stores] WHERE product_id = {0}", id);

                        // Xóa các bản ghi liên quan trong bảng Supplies
                        await _context.Database.ExecuteSqlRawAsync(
                            "DELETE FROM [Supplies] WHERE product_id = {0}", id);

                        // Xóa sản phẩm
                        await _context.Database.ExecuteSqlRawAsync(
                            "DELETE FROM [Product] WHERE product_id = {0}", id);

                        await transaction.CommitAsync();
            return NoContent();
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                }
            });
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

        private class StockResult
        {
            public int TotalStock { get; set; }
        }

        private class StatusResult
        {
            public string StockStatus { get; set; }
        }

        [HttpGet("{id}/total-stock")]
        public async Task<IActionResult> GetTotalStock(int id)
        {
            int totalStock = 0;
            var conn = _context.Database.GetDbConnection();
            try
            {
                if (conn.State != System.Data.ConnectionState.Open)
                    await conn.OpenAsync();
                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT dbo.GetTotalStock(@id)";
                    var param = command.CreateParameter();
                    param.ParameterName = "@id";
                    param.Value = id;
                    command.Parameters.Add(param);
                    var result = await command.ExecuteScalarAsync();
                    totalStock = result != null ? Convert.ToInt32(result) : 0;
                }
            }
            finally
            {
                if (conn.State == System.Data.ConnectionState.Open)
                    await conn.CloseAsync();
            }
            return Ok(new { productId = id, totalStock });
        }

        [HttpGet("{id}/stock-status")]
        public async Task<IActionResult> GetStockStatus(int id)
        {
            string status = "Unknown";
            var conn = _context.Database.GetDbConnection();
            try
            {
                if (conn.State != System.Data.ConnectionState.Open)
                    await conn.OpenAsync();
                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT dbo.CheckStockStatus(@id)";
                    var param = command.CreateParameter();
                    param.ParameterName = "@id";
                    param.Value = id;
                    command.Parameters.Add(param);
                    var result = await command.ExecuteScalarAsync();
                    status = result != null ? result.ToString() : "Unknown";
                }
            }
            finally
            {
                if (conn.State == System.Data.ConnectionState.Open)
                    await conn.CloseAsync();
            }
            return Ok(new { productId = id, status });
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
} 