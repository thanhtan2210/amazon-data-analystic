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
        public string CustomerName { get; set; }
        [Column("email")]
        public string Email { get; set; }
        [Column("phone_number")]
        public string PhoneNumber { get; set; }
        [Column("signup_date")]
        public DateTime SignupDate { get; set; }
        [Column("street")]
        public string Street { get; set; }
        [Column("district")]
        public string District { get; set; }
        [Column("postal_number")]
        public string PostalNumber { get; set; }

        [NotMapped]
        public ICollection<Order> Orders { get; set; }
    }
} 