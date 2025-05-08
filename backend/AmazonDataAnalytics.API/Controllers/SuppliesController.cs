using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using System.Threading.Tasks;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SuppliesController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Supplies.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Supplies model)
        {
            _context.Supplies.Add(model);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(int supplierId, int productId)
        {
            var entry = await _context.Supplies.FindAsync(supplierId, productId);
            if (entry == null) return NotFound();
            _context.Supplies.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 