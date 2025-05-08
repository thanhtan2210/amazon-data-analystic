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
        [Column("start_date")]
        public DateTime StartDate { get; set; }
        [Column("end_date")]
        public DateTime? EndDate { get; set; }
        [NotMapped]
        public required Employee Employee { get; set; }
        [NotMapped]
        public required Warehouse Warehouse { get; set; }
    }

    [Table("Manages")]
    public class Manages
    {
        [Column("employee_id")]
        public int EmployeeId { get; set; }
        [Column("order_id")]
        public int OrderId { get; set; }
        [Column("start_date")]
        public DateTime StartDate { get; set; }
        [Column("end_date")]
        public DateTime? EndDate { get; set; }
        [NotMapped]
        public required Employee Employee { get; set; }
        [NotMapped]
        public required Order Order { get; set; }
    }

    [Table("Supplies")]
    public class Supplies
    {
        [Column("supplier_id")]
        public int SupplierId { get; set; }
        [Column("product_id")]
        public int ProductId { get; set; }
        [NotMapped]
        public required Supplier Supplier { get; set; }
        [NotMapped]
        public required Product Product { get; set; }
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
        [Column("last_updated")]
        public DateTime LastUpdated { get; set; }
        [NotMapped]
        public required Warehouse Warehouse { get; set; }
        [NotMapped]
        public required Product Product { get; set; }
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
        public required Order Order { get; set; }
        [NotMapped]
        public required Product Product { get; set; }
    }

    [Table("Apply")]
    public class Apply
    {
        [Column("discount_id")]
        public int DiscountId { get; set; }
        [Column("order_id")]
        public int OrderId { get; set; }
        [Column("discount", TypeName = "decimal(5,2)")]
        public decimal DiscountAmount { get; set; }
        [NotMapped]
        public required Order Order { get; set; }
        [NotMapped]
        public required Discount Discount { get; set; }
    }
} 