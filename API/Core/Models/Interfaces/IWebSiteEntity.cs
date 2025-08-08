using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Interfaces
{
    public interface IWebSiteEntity
    {
        DateTime CreatedDate { get; set; }
        DateTime UpdatedDate { get; set; }
    }
}
