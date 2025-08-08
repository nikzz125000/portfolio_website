using Core.DB;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;
using Repository.Shared;

namespace Repository.Services
{
    public class ProjectRepository : IProjectRepository
    {
        readonly ApplicationDbContext _context;
        readonly IConfiguration _config;
        public ProjectRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        public async Task<int> CreateOrModify(Project model)
        {

            if (model.ProjectContainerId != 0)
            {
                //Upadte 
                _context.Projects.Update(model);

            }
            else
            {
                //Add new
                _context.Projects.Add(model);
            }
            await _context.SaveChangesAsync();
            return model.ProjectId;
        }
        public async Task<Project?> GetById(int ProjectId)
        {
            return await _context.Projects.FindAsync(ProjectId);
        }
        public async Task<List<Project>> GetByProjectContainerId(int ProjectContainerId)
        {
            return await _context.Projects.Where(x => x.ProjectContainerId == ProjectContainerId).ToListAsync();
        }
        public async Task<bool> DeleteProject(int ProjectId)
        {
            Project? proj = await _context.Projects.FindAsync(ProjectId);
            if (proj != null)
            {
                _context.Projects.Remove(proj);
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
