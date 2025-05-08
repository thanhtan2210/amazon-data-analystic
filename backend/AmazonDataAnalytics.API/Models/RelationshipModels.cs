using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Supervises")]
    public class Supervises
    {
        [Column("employee_id")]
        public int EmployeeId { get; set; }
        [Column("warehouse_id")]
        public int WarehouseId { get; set; }
        [NotMapped]
        public Employee Employee { get; set; }
        [NotMapped]
        public Warehouse Warehouse { get; set; }
    }

    [Table("Manages")]
    public class Manages
    {
        [Column("employee_id")]
        public int EmployeeId { get; set; }
        [Column("order_id")]
        public int OrderId { get; set; }
        [NotMapped]
        public Employee Employee { get; set; }
        [NotMapped]
        public Order Order { get; set; }
    }

    [Table("Supplies")]
    public class Supplies
    {
        [Column("supplier_id")]
        public int SupplierId { get; set; }
        [Column("product_id")]
        public int ProductId { get; set; }
        [NotMapped]
        public Supplier Supplier { get; set; }
        [NotMapped]
        public Product Product { get; set; }
    }

    [Table("Stores")]
    public class Stores
    {
        [Column("warehouse_id")]
        public int WarehouseId { get; set; }
        [Column("product_id")]
        public int ProductId { get; set; }
        [Column("stock_quantity")]
        public int StockQuantity { get; set; }
        [NotMapped]
        public Warehouse Warehouse { get; set; }
        [NotMapped]
        public Product Product { get; set; }
    }

    [Table("Contains")]
    public class Contains
    {
        [Column("order_id")]
        public int OrderId { get; set; }
        [Column("product_id")]
        public int ProductId { get; set; }
        [Column("quantity")]
        public int Quantity { get; set; }
        [NotMapped]
        public Order Order { get; set; }
        [NotMapped]
        public Product Product { get; set; }
    }

    [Table("Apply")]
    public class Apply
    {
        [Column("discount_id")]
        public int DiscountId { get; set; }
        [Column("order_id")]
        public int OrderId { get; set; }
        [NotMapped]
        public Discount Discount { get; set; }
        [NotMapped]
        public Order Order { get; set; }
    }
} 