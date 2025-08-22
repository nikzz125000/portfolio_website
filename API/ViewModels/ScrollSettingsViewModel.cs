using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels
{
    
    public class ScrollSettingsPostModel
    {
        public int ScrollSettingsId { get; set; }
        public decimal Smoothness { get; set; }
    }
    public class ScrollSettingsViewModel
    {
        public int ScrollSettingsId { get; set; }
        public decimal Smoothness { get; set; }
    }
}
