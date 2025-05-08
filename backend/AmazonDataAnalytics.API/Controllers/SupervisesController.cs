using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;
using System.Threading.Tasks;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupervisesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SupervisesController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Supervises.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Supervises model)
        {
            _context.Supervises.Add(model);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(int employeeId, int warehouseId)
        {
            var entry = await _context.Supervises.FindAsync(employeeId, warehouseId);
            if (entry == null) return NotFound();
            _context.Supervises.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 