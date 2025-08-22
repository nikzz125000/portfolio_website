using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IScrollSettingRepository
    {
        Task<int> CreateOrModify(ScrollSetting model);
        Task<ScrollSetting?> GetById();
    }
}
