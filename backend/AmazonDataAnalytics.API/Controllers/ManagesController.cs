using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using System.Threading.Tasks;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ManagesController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Manages.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Manages model)
        {
            _context.Manages.Add(model);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(int employeeId, int orderId)
        {
            var entry = await _context.Manages.FindAsync(employeeId, orderId);
            if (entry == null) return NotFound();
            _context.Manages.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 