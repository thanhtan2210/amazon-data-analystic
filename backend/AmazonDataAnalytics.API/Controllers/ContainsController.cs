using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using System.Threading.Tasks;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContainsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ContainsController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Contains.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Contains model)
        {
            _context.Contains.Add(model);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(int orderId, int productId)
        {
            var entry = await _context.Contains.FindAsync(orderId, productId);
            if (entry == null) return NotFound();
            _context.Contains.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 