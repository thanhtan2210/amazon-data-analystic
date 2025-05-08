using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;

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
        public async Task<IActionResult> GetAll() => Ok(await _context.Orders.ToListAsync());

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
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Xóa các bản ghi liên quan trong bảng Contains trước
            var contains = _context.Contains.Where(c => c.OrderId == id);
            _context.Contains.RemoveRange(contains);

            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 