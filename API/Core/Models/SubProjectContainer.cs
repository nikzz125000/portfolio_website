using Shared.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models
{
    public class SubProjectContainer : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SubProjectContainerId { get; set; }
        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        public int SortOrder { get; set; } = 1;

        [MaxLength(255)]
        public string? BackgroundImageFileName { get; set; }

        public decimal? BackgroundImageAspectRatio { get; set; }
        public BackgroundType BackgroundType { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
        
    }
} 