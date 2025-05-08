using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Models;

namespace AmazonDataAnalytics.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Shipping> Shippings { get; set; }
        public DbSet<Contains> Contains { get; set; }
        public DbSet<Stores> Stores { get; set; }
        public DbSet<Supplies> Supplies { get; set; }
        public DbSet<Manages> Manages { get; set; }
        public DbSet<Supervises> Supervises { get; set; }
        public DbSet<Apply> Apply { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.CustomerId);

            modelBuilder.Entity<Shipping>()
                .HasOne(s => s.Order)
                .WithOne()
                .HasForeignKey<Shipping>(s => s.OrderId);

            // Configure composite keys for relationship tables
            modelBuilder.Entity<Supervises>()
                .HasKey(s => new { s.EmployeeId, s.WarehouseId });

            modelBuilder.Entity<Manages>()
                .HasKey(m => new { m.EmployeeId, m.OrderId });

            modelBuilder.Entity<Supplies>()
                .HasKey(s => new { s.SupplierId, s.ProductId });

            modelBuilder.Entity<Stores>()
                .HasKey(s => new { s.WarehouseId, s.ProductId });

            modelBuilder.Entity<Contains>()
                .HasKey(c => new { c.OrderId, c.ProductId });

            modelBuilder.Entity<Apply>()
                .HasKey(a => new { a.DiscountId, a.OrderId });
        }
    }
} 