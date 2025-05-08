using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Product")]
    public class Product
    {
        [Key]
        [Column("product_id")]
        public int ProductId { get; set; }
        [Column("product_name")]
        public required string ProductName { get; set; }
        [Column("description")]
        public required string Description { get; set; }
        [Column("price", TypeName = "decimal(12,2)")]
        public decimal Price { get; set; }
        [Column("weight", TypeName = "decimal(10,2)")]
        public decimal Weight { get; set; }
        [Column("category")]
        public required string Category { get; set; }
        [Column("brand")]
        public required string Brand { get; set; }
        [Column("date_added")]
        public DateTime DateAdded { get; set; }
        [Column("images")]
        public required string Images { get; set; }
        [Column("length", TypeName = "decimal(10,2)")]
        public decimal Length { get; set; }
        [Column("width", TypeName = "decimal(10,2)")]
        public decimal Width { get; set; }
        [Column("height", TypeName = "decimal(10,2)")]
        public decimal Height { get; set; }

        // Navigation properties
        [NotMapped]
        public ICollection<Stores> Stores { get; set; } = new List<Stores>();
        [NotMapped]
        public ICollection<Contains> Contains { get; set; } = new List<Contains>();
        [NotMapped]
        public ICollection<Supplies> Supplies { get; set; } = new List<Supplies>();
    }
} 