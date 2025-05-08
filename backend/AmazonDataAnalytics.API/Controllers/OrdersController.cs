using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Select(o => new {
                    order_id = o.OrderId,
                    order_date = o.OrderDate,
                    order_status = o.OrderStatus,
                    customer_id = o.CustomerId,
                    products = _context.Contains
                        .Where(c => c.OrderId == o.OrderId)
                        .Join(_context.Products, c => c.ProductId, p => p.ProductId, (c, p) => new {
                            product_id = p.ProductId,
                            product_name = p.ProductName,
                            quantity = c.Quantity
                        }).ToList()
                })
                .ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = order.OrderId }, order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order order)
        {
            if (id != order.OrderId) return BadRequest();
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    var existingOrder = await _context.Orders.AsNoTracking().FirstOrDefaultAsync(o => o.OrderId == id);
                    if (existingOrder == null) return await Task.FromResult<IActionResult>(NotFound());
                    if (id != order.OrderId)
                    {
                        // Cập nhật order_id ở các bảng liên quan
                        await _context.Database.ExecuteSqlRawAsync("UPDATE [Contains] SET order_id = {0} WHERE order_id = {1}", order.OrderId, id);
                        await _context.Database.ExecuteSqlRawAsync("UPDATE Apply SET order_id = {0} WHERE order_id = {1}", order.OrderId, id);
                        await _context.Database.ExecuteSqlRawAsync("UPDATE Shippings SET order_id = {0} WHERE order_id = {1}", order.OrderId, id);
                    }
                    _context.Entry(order).State = EntityState.Modified;
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
                        await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Contains] WHERE order_id = {0}", id);
                        await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Apply] WHERE order_id = {0}", id);
                        await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Shipping] WHERE order_id = {0}", id);
                        await _context.Database.ExecuteSqlRawAsync("DELETE FROM [Order] WHERE order_id = {0}", id);
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
    }
} 