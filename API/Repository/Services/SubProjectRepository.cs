using Core.DB;
using Core.Models;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;

namespace Repository.Services
{
    public class SubProjectRepository : ISubProjectRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public SubProjectRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<int> CreateOrModify(SubProject entity)
        {
            if (entity.SubProjectId != 0)
            {
                _context.SubProjects.Update(entity);
            }
            else
            {
                _context.SubProjects.Add(entity);
            }
            await _context.SaveChangesAsync();
            return entity.SubProjectId;
        }
    }
} 