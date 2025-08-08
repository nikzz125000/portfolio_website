using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Models.Interfaces;

namespace Core.Models
{
    public class WebSiteEntity : IWebSiteEntity
    {
        public WebSiteEntity()
        {
            UpdatedDate = DateTime.UtcNow;
            CreatedDate = DateTime.UtcNow;
        }

        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime UpdatedDate { get; set; }
    }
}
