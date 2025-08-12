using Core.Models;

namespace Repository.Interfaces
{
    public interface ISubProjectContainerRepository
    {
        Task<int> CreateOrModify(SubProjectContainer entity);
        Task<List<SubProjectContainer>> GetAllByProjectId(int ProjectId);
        Task<SubProjectContainer?> GetById(int SubProjectContainerId);
        Task<bool> Delete(int ContainerId);
    }
} 