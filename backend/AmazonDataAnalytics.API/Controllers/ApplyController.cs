using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using System.Threading.Tasks;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ApplyController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Apply.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Apply model)
        {
            _context.Apply.Add(model);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(int discountId, int orderId)
        {
            var entry = await _context.Apply.FindAsync(discountId, orderId);
            if (entry == null) return NotFound();
            _context.Apply.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 