using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Order")]
    public class Order
    {
        [Key]
        [Column("order_id")]
        public int OrderId { get; set; }
        [Column("order_date")]
        public DateTime OrderDate { get; set; }
        [Column("order_status")]
        public string OrderStatus { get; set; }
        [Column("quantity")]
        public int Quantity { get; set; }
        [Column("customer_id")]
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        [NotMapped]
        public Customer Customer { get; set; }

        [NotMapped]
        public ICollection<Contains> Contains { get; set; }
        [NotMapped]
        public ICollection<Manages> Manages { get; set; }
        [NotMapped]
        public ICollection<Apply> Applies { get; set; }
    }
} 