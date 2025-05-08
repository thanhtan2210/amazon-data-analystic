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
        public string WarehouseName { get; set; }
        [Column("area", TypeName = "decimal(18,2)")]
        public decimal Area { get; set; }
        [Column("capacity", TypeName = "decimal(18,2)")]
        public decimal Capacity { get; set; }
        [Column("status")]
        public string Status { get; set; }
        [Column("phone_number")]
        public string PhoneNumber { get; set; }
        [Column("stock_quantity")]
        public int StockQuantity { get; set; }

        // Navigation properties
        [NotMapped]
        public ICollection<Stores> Stores { get; set; }
        [NotMapped]
        public ICollection<Supervises> Supervises { get; set; }
    }
} 