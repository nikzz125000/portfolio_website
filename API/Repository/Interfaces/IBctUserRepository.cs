using Core.Models;
using Repository.Shared;
using ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IBctUserRepository
    {
        Task<bool> CreateOrModify(BctUser BctUser);
        Task<List<BctUser>> GetAllAsync();
        Task<BctUser> GetById(int BctUserId);
        Task<BctUser> GetDataByUserName(string userName);
        // Task<BctUser> GetUserByMobileNumber(string mobileNumber);
        Task<BctUser> GetUserByUsernameAndPasswordId(AccountLoginModel model);
        Task<BctUser> UpdateUserAsync(BctUser user);
        Task<int> SaveAndGetId(BctUser BctUser);
        Task<BctUser> GetUsersByEmailId(string emailId);
        Task<bool> IsUserNameExist(string userName);
        Task<bool> IsMobileEmailExist(string mobileNumbetr, string countryCode, string email);
        Task<BctUser> GetUserByMobileNumber(string countryCode, string mobileNumber);
        Task<BctUser> GetUserByUserIdAndPassword(int userId, string password);
        Task<bool> IsRegexUserExist();


    }
}
