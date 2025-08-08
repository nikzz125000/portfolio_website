using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Project : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProjectId { get; set; }

        [ForeignKey("Container")]
        public int ProjectContainerId { get; set; }

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

        // Navigation property
        public virtual ProjectContainer Container { get; set; } = null!;
    }
}
