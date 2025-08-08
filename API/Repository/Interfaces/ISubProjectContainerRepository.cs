using Core.Models;

namespace Repository.Interfaces
{
    public interface ISubProjectContainerRepository
    {
        Task<int> CreateOrModify(SubProjectContainer entity);
    }
} 