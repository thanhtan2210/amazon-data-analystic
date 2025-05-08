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
        public string CompanyName { get; set; }
        [Column("representative_name")]
        public string RepresentativeName { get; set; }
        [Column("phone_number")]
        public string PhoneNumber { get; set; }
        [Column("email")]
        public string Email { get; set; }
        [NotMapped]
        public ICollection<Supplies> Supplies { get; set; }
    }
} 