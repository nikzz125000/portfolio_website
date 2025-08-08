using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models
{
    public class BctUserCredential : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BctUserCredentialId { get; set; }

        public int BctUserId { get; set; }

        [MaxLength(100)]
        public string Password { get; set; }

        public string? RefreshToken { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // Navigation property to reference the related BctUser entity
        //public BctUser? BctUser { get; set; }
    }
}