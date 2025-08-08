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
        public int ProjectContainerId { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string Title { get; set; }
        public int SortOrder { get; set; }
        public decimal? BackgroundImageAspectRatio { get; set; }
        public string? BackgroundImageUrl { get; set; } // For the uploaded image URL
        public List<ProjectPostModel> Projects { get; set; } = new List<ProjectPostModel>();
    }

    public class ProjectPostModel
    {
        public int ProjectId { get; set; } // Foreign key
        public string Name { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? ProjectImageUrl { get; set; } // For the uploaded image URL
        public int XPosition { get; set; }
        public int YPosition { get; set; }
        public decimal HeightPercent { get; set; }
        public string Animation { get; set; }
        public string AnimationSpeed { get; set; }
        public string AnimationTrigger { get; set; }
        public bool IsExterior { get; set; }
    }
    public class ProjectContainerViewModel
    {
        public int ProjectContainerId { get; set; }
        public string Title { get; set; }
        public int SortOrder { get; set; }
        public decimal? BackgroundImageAspectRatio { get; set; }
        public string? BackgroundImageUrl { get; set; } // For the uploaded image URL
        public string? BackgroundImageFileName { get; set; }

    }
    public class ProjectContainerDetailsViewModel
    {
        public int ProjectContainerId { get; set; }
        public string Title { get; set; }
        public int SortOrder { get; set; }
        public decimal? BackgroundImageAspectRatio { get; set; }
        public string? BackgroundImageUrl { get; set; } // For the uploaded image URL
        public string? BackgroundImageFileName { get; set; }
        public List<ProjectViewModel> Projects { get; set; } = new List<ProjectViewModel>();
    }
    public class ProjectViewModel
    {
        public int ProjectId { get; set; } // Foreign key
        public string Name { get; set; }
        public string? ImageFileName { get; set; }

        public string? ProjectImageUrl { get; set; } // For the uploaded image URL
        public int XPosition { get; set; }
        public int YPosition { get; set; }
        public decimal HeightPercent { get; set; }
        public string Animation { get; set; }
        public string AnimationSpeed { get; set; }
        public string AnimationTrigger { get; set; }
        public bool IsExterior { get; set; }
    }
}

