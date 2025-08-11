using Shared.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models
{
    public class SubProject : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SubProjectId { get; set; }
        [ForeignKey("SubProjectContainer")]
        public int SubProjectContainerId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        public decimal XPosition { get; set; }

        public decimal YPosition { get; set; }

        public decimal HeightPercent { get; set; }

        [MaxLength(100)]
        public string? Animation { get; set; }

        [MaxLength(50)]
        public string AnimationSpeed { get; set; } = "normal";

        [MaxLength(50)]
        public string AnimationTrigger { get; set; } = "once";

        public bool IsExterior { get; set; } = false;

        public int SortOrder { get; set; } = 1;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
        public string ImageFileName { get; set; }
        public virtual SubProjectContainer SubProjectContainer { get; set; } = null!;
    }
} 