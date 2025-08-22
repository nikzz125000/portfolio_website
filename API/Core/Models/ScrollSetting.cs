using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class ScrollSetting : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScrollSettingId { get; set; }
        public decimal Smoothness { get; set; }
        public decimal Wheel { get; set; }
        public decimal Touch { get; set; }
        public decimal Keyboard { get; set; }
        public decimal Momentum { get; set; }

    }
}
