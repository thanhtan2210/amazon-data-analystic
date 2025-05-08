using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using AmazonDataAnalytics.API.Models;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public CustomersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _context.Customers.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = customer.CustomerId }, customer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Customer customer)
    {
        if (id != customer.CustomerId) return BadRequest();
        _context.Entry(customer).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // Xóa các đơn hàng của customer (nếu muốn xóa cascade)
        var orders = _context.Orders.Where(o => o.CustomerId == id);
        foreach (var order in orders)
        {
            var contains = _context.Contains.Where(c => c.OrderId == order.OrderId);
            _context.Contains.RemoveRange(contains);
        }
        _context.Orders.RemoveRange(orders);

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();
        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("filter")]
    public async Task<IActionResult> Filter([FromQuery] string? name, [FromQuery] string? email, [FromQuery] string? district)
    {
        var query = _context.Customers.AsQueryable();
        if (!string.IsNullOrEmpty(name))
            query = query.Where(c => c.CustomerName.Contains(name));
        if (!string.IsNullOrEmpty(email))
            query = query.Where(c => c.Email.Contains(email));
        if (!string.IsNullOrEmpty(district))
            query = query.Where(c => c.District == district);
        var result = await query.ToListAsync();
        return Ok(result);
    }
} 