using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Container : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        public int SortOrder { get; set; } = 1;

        [MaxLength(255)]
        public string? BackgroundImageFileName { get; set; }

        public decimal? BackgroundImageAspectRatio { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
