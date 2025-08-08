using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class SessionResetPassword : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SessionResetPasswordId { get; set; }

        [MaxLength(50)]
        public string UserName { get; set; }

        public string Key { get; set; }
    }
}
