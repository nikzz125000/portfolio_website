using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Enums;

namespace Core.Models
{
    public class BctUser : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BctUserId { get; set; }

        [MaxLength(50)]
        public string FirstName { get; set; }

        [MaxLength(50)]
        public string? LastName { get; set; }

        [MaxLength(100)]
        public string EmailId { get; set; }

        [MaxLength(20)]
        public string MobileNumber { get; set; }

        [MaxLength(10)]
        public string CountryCode { get; set; }

        [MaxLength(50)]
        public string UserName { get; set; }

        public Status Status { get; set; }

        public bool IsMobileNumberVerified { get; set; }

        public bool IsEmailVerified { get; set; }

        public bool IsVerified { get; set; }

        public BCTUserType UserType { get; set; }
    }
}