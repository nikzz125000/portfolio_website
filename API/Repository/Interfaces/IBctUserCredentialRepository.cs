using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IBctUserCredentialRepository
    {
        Task<bool> CreateOrModify(BctUserCredential item);
        Task<int> CreateAndGetId(BctUserCredential item);
        Task<BctUserCredential> GetById(int BctUserCredentialId);
        Task<bool> DeleteById(int BctUserCredentialId);
        Task<List<BctUserCredential>> GetAllAsync();
        Task<BctUserCredential?> GetByUserId(int userId);
    }
}
