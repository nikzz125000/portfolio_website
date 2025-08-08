using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels
{
    public class ProjectContainerPostModel
    {
        public int ContainerId { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string Title { get; set; }
        public int SortOrder { get; set; }
        public decimal? BackgroundImageAspectRatio { get; set; }

    }
}
