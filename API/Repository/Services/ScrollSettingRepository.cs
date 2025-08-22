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
    public class ScrollSettingRepository : IScrollSettingRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public ScrollSettingRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<int> CreateOrModify(ScrollSetting model)
        {
            if (model.ScrollSettingId != 0)
            {
                _context.ScrollSettings.Update(model);
            }
            else
            {
                _context.ScrollSettings.Add(model);
            }
            await _context.SaveChangesAsync();
            return model.ScrollSettingId;
        }

        public async Task<ScrollSetting?> GetById()
        {
            return await _context.ScrollSettings.FirstOrDefaultAsync();
        }
    }
}
