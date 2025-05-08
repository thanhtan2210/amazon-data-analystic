using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShippingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ShippingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Shippings.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var shipping = await _context.Shippings.FindAsync(id);
            if (shipping == null) return NotFound();
            return Ok(shipping);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Shipping shipping)
        {
            _context.Shippings.Add(shipping);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = shipping.ShippingId }, shipping);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Shipping shipping)
        {
            if (id != shipping.ShippingId) return BadRequest();
            _context.Entry(shipping).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var shipping = await _context.Shippings.FindAsync(id);
            if (shipping == null) return NotFound();
            _context.Shippings.Remove(shipping);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 