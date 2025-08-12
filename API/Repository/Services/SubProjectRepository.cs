using Core.DB;
using Core.Models;
using Microsoft.EntityFrameworkCore;
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
        public async Task<List<SubProject>> GetBySubProjectContainerId(int SubProjectContainerId)
        {
            return await _context.SubProjects.Where(x => x.SubProjectContainerId == SubProjectContainerId).ToListAsync();
        }
        public async Task<SubProject?> GetById(int SubProjectId)
        {
            return await _context.SubProjects.FindAsync(SubProjectId);
        }
        public async Task<bool> DeleteProject(int SubProjectId)
        {
            SubProject? proj = await _context.SubProjects.FindAsync(SubProjectId);
            if (proj != null)
            {
                _context.SubProjects.Remove(proj);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
       
        public async Task<bool> DeleteAllProject(int SubProjectContainerId)
        {
            List<SubProject> proj = await _context.SubProjects.Where(x => x.SubProjectContainerId == SubProjectContainerId).ToListAsync();
            if (proj != null & proj.Count > 0)
            {
                _context.SubProjects.RemoveRange(proj);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
} 