using Core.Models;
using Repository.Shared;

namespace Repository.Interfaces
{
    public interface IProjectRepository
    {
        Task<int> CreateOrModify(Project model);
        Task<Project?> GetById(int ProjectId);
        Task<List<Project>> GetByProjectContainerId(int ProjectContainerId);
        Task<bool> DeleteProject(int ProjectId);
        Task<bool> DeleteAllProject(int ProjectContainerId);
        Task<List<Project>> GetAll();
        Task<List<Project>> GetNextProjects(int projectId);
    }
}
