using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Supplier")]
    public class Supplier
    {
        [Key]
        [Column("supplier_id")]
        public int SupplierId { get; set; }
        [Column("company_name")]
        public required string CompanyName { get; set; }
        [Column("representative_name")]
        public required string RepresentativeName { get; set; }
        [Column("phone_number")]
        public required string PhoneNumber { get; set; }
        [Column("email")]
        public required string Email { get; set; }
        [NotMapped]
        public ICollection<Supplies> Supplies { get; set; } = new List<Supplies>();
    }
} 