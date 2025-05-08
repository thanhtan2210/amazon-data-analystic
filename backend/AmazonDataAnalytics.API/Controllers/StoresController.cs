using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using System.Threading.Tasks;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public StoresController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Stores.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Stores model)
        {
            _context.Stores.Add(model);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(int warehouseId, int productId)
        {
            var entry = await _context.Stores.FindAsync(warehouseId, productId);
            if (entry == null) return NotFound();
            _context.Stores.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 