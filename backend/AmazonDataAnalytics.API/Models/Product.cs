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
        public string ProductName { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("price", TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        [Column("weight", TypeName = "decimal(18,2)")]
        public decimal Weight { get; set; }
        [Column("category")]
        public string Category { get; set; }
        [Column("brand")]
        public string Brand { get; set; }
        [Column("date_added")]
        public DateTime DateAdded { get; set; }
        [Column("images")]
        public string Images { get; set; }
        [Column("length", TypeName = "decimal(18,2)")]
        public decimal Length { get; set; }
        [Column("width", TypeName = "decimal(18,2)")]
        public decimal Width { get; set; }
        [Column("height", TypeName = "decimal(18,2)")]
        public decimal Height { get; set; }

        // Navigation properties
        [NotMapped]
        public ICollection<Stores> Stores { get; set; }
        [NotMapped]
        public ICollection<Contains> Contains { get; set; }
        [NotMapped]
        public ICollection<Supplies> Supplies { get; set; }
    }
} 