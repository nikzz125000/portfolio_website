using Core.Models;

namespace Repository.Interfaces
{
    public interface IResumeRepository
    {
        Task<int> CreateOrModify(Resume model);
        Task<Resume?> GetById();
    }
} 