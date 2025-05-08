using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazonDataAnalytics.API.Models
{
    [Table("Employee")]
    public class Employee
    {
        [Key]
        [Column("employee_id")]
        public int EmployeeId { get; set; }
        [Column("full_name")]
        public required string FullName { get; set; }
        [Column("department")]
        public required string Department { get; set; }
        [Column("hire_date")]
        public DateTime HireDate { get; set; }
        [Column("email")]
        public required string Email { get; set; }
        [Column("phone_number")]
        public required string PhoneNumber { get; set; }
        [Column("salary", TypeName = "decimal(12,2)")]
        public decimal Salary { get; set; }
        [Column("role")]
        public required string Role { get; set; }

        [NotMapped]
        public ICollection<Supervises> Supervises { get; set; } = new List<Supervises>();
        [NotMapped]
        public ICollection<Manages> Manages { get; set; } = new List<Manages>();
    }
} 