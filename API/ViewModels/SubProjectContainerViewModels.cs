using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace ViewModels
{
    public class SubProjectPostModel
    {
        public int SubProjectId { get; set; }
        public string Name { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? ProjectImageUrl { get; set; }
        public int XPosition { get; set; }
        public int YPosition { get; set; }
        public decimal HeightPercent { get; set; }
        public string Animation { get; set; }
        public string AnimationSpeed { get; set; }
        public string AnimationTrigger { get; set; }
        public bool IsExterior { get; set; }
    }

    public class SubProjectContainerPostModel
    {
        public int SubProjectContainerId { get; set; }
        public int ProjectId { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string Title { get; set; }
        public int SortOrder { get; set; }
        public decimal? BackgroundImageAspectRatio { get; set; }
        public string? BackgroundImageUrl { get; set; }
        public List<SubProjectPostModel> SubProjects { get; set; } = new List<SubProjectPostModel>();
    }

    public class SubProjectContainerViewModel
    {
        public int SubProjectContainerId { get; set; }
        public int ProjectId { get; set; }
        public string Title { get; set; }
        public int SortOrder { get; set; }
        public decimal? BackgroundImageAspectRatio { get; set; }
        public string? BackgroundImageUrl { get; set; }
        public string? BackgroundImageFileName { get; set; }
        public List<SubProjectViewModel> SubProjects { get; set; } = new List<SubProjectViewModel>();
    }

    public class SubProjectViewModel
    {
        public int SubProjectId { get; set; }
        public string Name { get; set; }
        public string? ImageFileName { get; set; }
        public string? ProjectImageUrl { get; set; }
        public int XPosition { get; set; }
        public int YPosition { get; set; }
        public decimal HeightPercent { get; set; }
        public string Animation { get; set; }
        public string AnimationSpeed { get; set; }
        public string AnimationTrigger { get; set; }
        public bool IsExterior { get; set; }
    }

    public class SubProjectContainerDetailsViewModel
    {
        public int SubProjectContainerId { get; set; }
        public int ProjectId { get; set; }
        public string Title { get; set; }
        public int SortOrder { get; set; }
        public decimal? BackgroundImageAspectRatio { get; set; }
        public string? BackgroundImageUrl { get; set; }
        public string? BackgroundImageFileName { get; set; }

        public List<SubProjectViewModel> SubProjects { get; set; } = new List<SubProjectViewModel>();
    }
} 