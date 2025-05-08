using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;

namespace AmazonDataAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalProducts = await _context.Products.CountAsync();
            var totalCustomers = await _context.Customers.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            var totalWarehouses = await _context.Warehouses.CountAsync();
            // Tổng doanh thu: sum(order.quantity * product.price) qua bảng Contains
            var totalRevenue = await (from c in _context.Contains
                join o in _context.Orders on c.OrderId equals o.OrderId
                join p in _context.Products on c.ProductId equals p.ProductId
                select c.Quantity * p.Price).SumAsync();

            return Ok(new
            {
                totalProducts,
                totalCustomers,
                totalOrders,
                totalWarehouses,
                totalRevenue
            });
        }

        [HttpGet("revenue-by-month")]
        public async Task<IActionResult> GetRevenueByMonth()
        {
            var data = await _context.Orders
                .Join(_context.Contains, o => o.OrderId, c => c.OrderId, (o, c) => new { o, c })
                .Join(_context.Products, oc => oc.c.ProductId, p => p.ProductId, (oc, p) => new { oc.o, oc.c, p })
                .GroupBy(x => new { x.o.OrderDate.Year, x.o.OrderDate.Month })
                .Select(g => new {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Sum(x => x.p.Price * x.c.Quantity)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();

            var result = data.Select(x => new {
                month = $"{x.Year}-{x.Month:D2}",
                revenue = x.Revenue
            });

            return Ok(result);
        }

        [HttpGet("orders-by-month")]
        public async Task<IActionResult> GetOrdersByMonth()
        {
            var data = await _context.Orders
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Orders = g.Count()
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();

            var result = data.Select(x => new {
                month = $"{x.Year}-{x.Month:D2}",
                orders = x.Orders
            });

            return Ok(result);
        }

        [HttpGet("revenue-by-product")]
        public async Task<IActionResult> GetRevenueByProduct()
        {
            var data = await _context.Products
                .Join(_context.Contains, p => p.ProductId, c => c.ProductId, (p, c) => new { p, c })
                .GroupBy(x => x.p.ProductName)
                .Select(g => new {
                    productName = g.Key,
                    revenue = g.Sum(x => x.p.Price * x.c.Quantity)
                })
                .OrderByDescending(x => x.revenue)
                .ToListAsync();
            return Ok(data);
        }
    }
} 