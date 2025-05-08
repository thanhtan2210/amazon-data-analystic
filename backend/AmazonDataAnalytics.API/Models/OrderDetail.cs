using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    public class OrderDetail
    {
        [Key]
        public int OrderDetailId { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }

        [ForeignKey("OrderId")]
        [NotMapped]
        public required Order Order { get; set; }

        [ForeignKey("ProductId")]
        [NotMapped]
        public required Product Product { get; set; }
    }
} 