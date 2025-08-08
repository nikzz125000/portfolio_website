using Core.DB;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels.Auth;
using ViewModels.Shared;

namespace Repository.Services
{
    internal class SessionResetPasswordRepository : ISessionResetPasswordRepository
    {
        readonly ApplicationDbContext _context;
        readonly IConfiguration _config;
        public SessionResetPasswordRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<CommonEntityResponse> Create(SessionResetPassword model)
        {
            CommonEntityResponse viewModel = new CommonEntityResponse();

            try
            {
                _context.SessionResetPasswords.Add(model);
                await _context.SaveChangesAsync();
                //viewModel.da

            }
            catch (Exception ex)
            {
                viewModel.CreateFailureResponse("failed: " + ex.Message);
            }
            return viewModel;
        }

        public async Task<bool> IsValidKey(updatePasswordModel model)
        {
            DateTime currentTime = DateTime.UtcNow;
            TimeSpan timeDifferenceThreshold = TimeSpan.FromMinutes(10);
            DateTime marginTime = currentTime - timeDifferenceThreshold;
            //var res= await _context.SessionResetPassword.FirstOrDefaultAsync(x => x.Key == model.Key && x.UserName== model.UserName);
            //if ((res.CreatedDate)
            //{

            //}
            return await _context.SessionResetPasswords.AnyAsync(x => x.Key == model.Key && x.UserName == model.UserName && x.CreatedDate >= marginTime);
        }

        public async Task<CommonEntityResponse> UpdatePassword(updatePasswordModel model)
        {
            CommonEntityResponse responce = new CommonEntityResponse();
            if (model.Key != null && model.Key != string.Empty)
            {
                List<SessionResetPassword> userSession = _context.SessionResetPasswords.Where(x => x.UserName == model.UserName).ToList();
                if (userSession != null)
                {
                    _context.SessionResetPasswords.RemoveRange(userSession);
                }
            }
            //var user= _context.vendorUsers.FirstOrDefault(x=>x.UserName== model.UserName)
            var user = await _context.BctUsers
              .Where(n => n.UserName == model.UserName)
              .Join(_context.BctUserCredentials, p => p.BctUserId, s => s.BctUserId, (p, s) => s)
              .FirstOrDefaultAsync();
            if (user != null)
            {
                user.Password = model.Password;
                user.UpdatedDate = DateTime.UtcNow;
                _context.BctUserCredentials.Update(user);
                await _context.SaveChangesAsync();
                responce.IsSuccess = true;
                responce.CreateSuccessResponse("Password updated successfully");
            }
            else
            {
                responce.IsSuccess = false;
                responce.CreateFailureResponse("User not found");
            }
            return responce;
        }
    }
}
