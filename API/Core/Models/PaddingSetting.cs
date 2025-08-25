using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class PaddingSetting : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaddingSettingId { get; set; }
        public decimal PaddingLeft { get; set; }
        public decimal PaddingRight { get; set; }
        public decimal PaddingBottom { get; set; }
        public decimal PaddingTop { get; set; }

    }
}
