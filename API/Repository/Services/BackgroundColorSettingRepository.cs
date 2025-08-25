using Core.DB;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Services
{
    public class BackgroundColorSettingRepository : IBackgroundColorSettingRepository
    {
        readonly ApplicationDbContext _context;
        readonly IConfiguration _config;
        public BackgroundColorSettingRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        public async Task<int> CreateOrModify(BackgroundColorSetting model)
        {

            if (model.BackgroundColorSettingId != 0)
            {
                //Upadte 
                _context.BackgroundColorSettings.Update(model);

            }
            else
            {
                //Add new
                _context.BackgroundColorSettings.Add(model);
            }
            await _context.SaveChangesAsync();
            return model.BackgroundColorSettingId;
        }
        public async Task<BackgroundColorSetting?> GetById(int BackgroundColorSettingId)
        {
            return await _context.BackgroundColorSettings.FindAsync(BackgroundColorSettingId);
        }
        public async Task<BackgroundColorSetting?> GetByTitle(string Title)
        {
            return await _context.BackgroundColorSettings.Where(x => x.Title == Title).FirstOrDefaultAsync();
        }
        public async Task<List<BackgroundColorSetting>> GetAll()
        {
            return await _context.BackgroundColorSettings.ToListAsync();
        }
    }
}
