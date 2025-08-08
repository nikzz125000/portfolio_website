using Core.Models;
using Repository.Shared;

namespace Repository.Interfaces
{
    public interface IProjectContainerRepository
    {
        Task<int> CreateOrModify(ProjectContainer container);
        Task<ProjectContainer?> GetById(int ContainerId);
        Task<List<ProjectContainer>> GetAll();
    }
}
