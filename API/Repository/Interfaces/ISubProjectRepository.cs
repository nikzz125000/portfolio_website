using Core.Models;

namespace Repository.Interfaces
{
    public interface ISubProjectRepository
    {
        Task<int> CreateOrModify(SubProject entity);
        Task<List<SubProject>> GetBySubProjectContainerId(int SubProjectContainerId);
    }
} 