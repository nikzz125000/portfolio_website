using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IPaddingSettingRepository
    {
        Task<int> CreateOrModify(PaddingSetting model);
        Task<PaddingSetting?> GetById();
    }
}
