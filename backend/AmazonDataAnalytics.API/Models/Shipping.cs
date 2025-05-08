using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Shipping")]
    public class Shipping
    {
        [Key]
        public int ShippingId { get; set; }
        [Column("cost", TypeName = "decimal(10,2)")]
        public decimal Cost { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public required string Status { get; set; }
        public required string TrackingNumber { get; set; }
        public required string CarrierName { get; set; }
        public required string TransportMode { get; set; }
        public required string ShippingStreet { get; set; }
        public required string ShippingDistrict { get; set; }
        public required string ShippingPostalNumber { get; set; }
        public int OrderId { get; set; }
        public DateTime ShippingDate { get; set; }
        public DateTime? DeliveryDate { get; set; }

        [ForeignKey("OrderId")]
        [NotMapped]
        public required Order Order { get; set; }
    }
} 