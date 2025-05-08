using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Shipping")]
    public class Shipping
    {
        [Key]
        public int ShippingId { get; set; }
        public decimal Cost { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; }
        public string TrackingNumber { get; set; }
        public string CarrierName { get; set; }
        public string TransportMode { get; set; }
        public string ShippingStreet { get; set; }
        public string ShippingDistrict { get; set; }
        public string ShippingPostalNumber { get; set; }
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        [NotMapped]
        public Order Order { get; set; }
    }
} 