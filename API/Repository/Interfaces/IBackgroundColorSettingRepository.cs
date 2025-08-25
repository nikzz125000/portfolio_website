using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IBackgroundColorSettingRepository
    {
        Task<int> CreateOrModify(BackgroundColorSetting model);
        Task<BackgroundColorSetting?> GetById(int ProjectId);
        Task<BackgroundColorSetting?> GetByTitle(string Title);
        Task<List<BackgroundColorSetting>> GetAll();
        
    }
}
