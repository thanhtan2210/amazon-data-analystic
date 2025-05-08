using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Warehouse")]
    public class Warehouse
    {
        [Key]
        [Column("warehouse_id")]
        public int WarehouseId { get; set; }
        [Column("warehouse_name")]
        public required string WarehouseName { get; set; }
        [Column("area", TypeName = "decimal(10,2)")]
        public decimal Area { get; set; }
        [Column("capacity", TypeName = "decimal(10,2)")]
        public decimal Capacity { get; set; }
        [Column("status")]
        public required string Status { get; set; }
        [Column("phone_number")]
        public required string PhoneNumber { get; set; }
        [Column("stock_quantity")]
        public int StockQuantity { get; set; }

        // Navigation properties
        [NotMapped]
        public ICollection<Stores> Stores { get; set; } = new List<Stores>();
        [NotMapped]
        public ICollection<Supervises> Supervises { get; set; } = new List<Supervises>();
    }
} 