using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels.Auth;
using ViewModels.Shared;

namespace Repository.Interfaces
{
    public interface ISessionResetPasswordRepository
    {
        Task<CommonEntityResponse> Create(SessionResetPassword model);
        Task<bool> IsValidKey(updatePasswordModel model);
        Task<CommonEntityResponse> UpdatePassword(updatePasswordModel model);

    }
}
