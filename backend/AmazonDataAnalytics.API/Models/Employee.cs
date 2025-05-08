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
        public string FullName { get; set; }
        [Column("department")]
        public string Department { get; set; }
        [Column("hire_date")]
        public DateTime HireDate { get; set; }
        [Column("email")]
        public string Email { get; set; }
        [Column("phone_number")]
        public string PhoneNumber { get; set; }
        [Column("salary", TypeName = "decimal(18,2)")]
        public decimal Salary { get; set; }
        [Column("role")]
        public string Role { get; set; }

        [NotMapped]
        public ICollection<Supervises> Supervises { get; set; }
        [NotMapped]
        public ICollection<Manages> Manages { get; set; }
    }
} 