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
        public decimal Smoothness { get; set; }
        public decimal Wheel { get; set; }
        public decimal Touch { get; set; }
        public decimal Keyboard { get; set; }
        public decimal Momentum { get; set; }
    }
    public class ScrollSettingsViewModel
    {
        public decimal Smoothness { get; set; }
        public decimal Wheel { get; set; }
        public decimal Touch { get; set; }
        public decimal Keyboard { get; set; }
        public decimal Momentum { get; set; }
    }
}
