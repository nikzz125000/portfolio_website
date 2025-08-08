using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Shared;
using ViewModels;

namespace Repository.Interfaces
{
    public interface IExceptionLogRepository
    {
        Task<bool> Create(ExceptionLog model);
        Task<IPagedList<ExceptionLogViewModel>> GetAllPaged(ExceptionLogRequestModel Model);

    }
}
