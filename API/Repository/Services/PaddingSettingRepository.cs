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
    
    public class PaddingSettingRepository : IPaddingSettingRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public PaddingSettingRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<int> CreateOrModify(PaddingSetting model)
        {
            if (model.PaddingSettingId != 0)
            {
                _context.PaddingSettings.Update(model);
            }
            else
            {
                _context.PaddingSettings.Add(model);
            }
            await _context.SaveChangesAsync();
            return model.PaddingSettingId;
        }

        public async Task<PaddingSetting?> GetById()
        {
            return await _context.PaddingSettings.FirstOrDefaultAsync();
        }
    }
}
