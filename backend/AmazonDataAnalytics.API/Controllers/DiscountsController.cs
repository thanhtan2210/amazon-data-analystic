using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiscountsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public DiscountsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Discounts.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null) return NotFound();
            return Ok(discount);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Discount discount)
        {
            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = discount.DiscountId }, discount);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Discount discount)
        {
            if (id != discount.DiscountId) return BadRequest();
            _context.Entry(discount).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null) return NotFound();
            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 