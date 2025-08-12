using Core.DB;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;
using Repository.Shared;
using System.Reflection;

namespace Repository.Services
{
    public class ContainerRepository : IProjectContainerRepository
    {
        readonly ApplicationDbContext _context;
        readonly IConfiguration _config;
        public ContainerRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        public async Task<int> CreateOrModify(ProjectContainer container)
        {

            if (container.ProjectContainerId != 0)
            {
                //Upadte 
                _context.ProjectContainers.Update(container);

            }
            else
            {
                //Add new
                _context.ProjectContainers.Add(container);
            }
            await _context.SaveChangesAsync();
            return container.ProjectContainerId;
        }
        public async Task<ProjectContainer?> GetById(int ContainerId)
        {
            return await _context.ProjectContainers.FindAsync(ContainerId);
        }
        public async Task<List<ProjectContainer>> GetAll()
        {
            return await _context.ProjectContainers.OrderBy(x=>x.SortOrder).ToListAsync();
        }

        public async Task<bool> Delete(int ContainerId)
        {
            ProjectContainer? proj = await _context.ProjectContainers.FindAsync(ContainerId);
            if (proj != null)
            {
                _context.ProjectContainers.Remove(proj);
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
