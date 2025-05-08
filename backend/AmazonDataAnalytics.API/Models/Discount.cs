using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Discount")]
    public class Discount
    {
        [Key]
        [Column("discount_id")]
        public int DiscountId { get; set; }
        [Column("discount_name")]
        public string DiscountName { get; set; }
        [Column("discount_type")]
        public string DiscountType { get; set; }
        [Column("discount_value", TypeName = "decimal(18,2)")]
        public decimal DiscountValue { get; set; }
        [Column("start_date")]
        public DateTime StartDate { get; set; }
        [Column("end_date")]
        public DateTime EndDate { get; set; }

        [NotMapped]
        public ICollection<Apply> Applies { get; set; }
    }
} 