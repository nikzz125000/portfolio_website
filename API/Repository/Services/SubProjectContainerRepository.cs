using Core.DB;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;

namespace Repository.Services
{
    public class SubProjectContainerRepository : ISubProjectContainerRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public SubProjectContainerRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<int> CreateOrModify(SubProjectContainer entity)
        {
            if (entity.SubProjectContainerId != 0)
            {
                _context.SubProjectContainers.Update(entity);
            }
            else
            {
                _context.SubProjectContainers.Add(entity);
            }
            await _context.SaveChangesAsync();
            return entity.SubProjectContainerId;
        }
        public async Task<List<SubProjectContainer>> GetAllByProjectId(int ProjectId)
        {
           return await _context.SubProjectContainers.Where(x => x.ProjectId == ProjectId).OrderBy(x=>x.SortOrder).ToListAsync();
        }
    }
} 