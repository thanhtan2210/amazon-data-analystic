using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Customer")]
    public class Customer
    {
        [Key]
        [Column("customer_id")]
        public int CustomerId { get; set; }
        [Column("customer_name")]
        public required string CustomerName { get; set; }
        [Column("email")]
        public required string Email { get; set; }
        [Column("phone_number")]
        public required string PhoneNumber { get; set; }
        [Column("signup_date")]
        public DateTime SignupDate { get; set; }
        [Column("street")]
        public required string Street { get; set; }
        [Column("district")]
        public required string District { get; set; }
        [Column("postal_number")]
        public required string PostalNumber { get; set; }

        [NotMapped]
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
} 