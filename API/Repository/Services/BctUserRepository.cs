using Core.DB;
using Core.Models;
using Repository.Interfaces;
using Repository.Shared;
using Shared.Enums;
using ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Services
{
    
    public class BctUserRepository : BaseRepository<BctUser>, IBctUserRepository
    {
        readonly ApplicationDbContext _context;
        readonly IConfiguration _config;
        public BctUserRepository(ApplicationDbContext context, IConfiguration config) : base(config, context)
        {
            _context = context;
            _config = config;
        }
        /// <summary>
        /// This method is used to create new BctUser(BctUserId=0) or to modify existing BctUser with UserId. Vendor user represents the users of organization and shop
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<bool> CreateOrModify(BctUser BctUser)
        {
            bool result = false;
            if (BctUser.BctUserId != 0)
            {
                //Upadte 
                _context.BctUsers.Update(BctUser);

            }
            else
            {
                //Add new
                _context.BctUsers.Add(BctUser);
            }
            try
            {
                await _context.SaveChangesAsync();
                result = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return result;
        }

        /// <summary>
        /// This method is used to create new organization and return created id
        /// </summary>
        /// <param name="BctUser"></param>
        /// <returns></returns>
        public async Task<int> SaveAndGetId(BctUser BctUser)
        {
            //Add new organization
            _context.BctUsers.Add(BctUser);
            await _context.SaveChangesAsync();
            return BctUser.BctUserId;
        }
        /// <summary>
        /// This method is used to get All vendor users
        /// </summary>
        /// <returns></returns>
        public async Task<List<BctUser>> GetAllAsync()
        {
            return await _context.BctUsers.ToListAsync();
        }
        /// <summary>
        ///This method is used to get single user details by Id 
        /// </summary>
        /// <param name="BctUserId"></param>
        /// <returns></returns>
        public async Task<BctUser> GetById(int BctUserId)
        {
            return await _context.BctUsers.FindAsync(BctUserId);
        }

        //public async Task<BctUsers> GetByGUID(string BctUserGUID)
        //{
        //    return await _context.BctUsers.Where(x => x.BctUserGUID == BctUserGUID).FirstOrDefaultAsync();
        //}
        public async Task<BctUser> GetUserByUsernameAndPasswordId(AccountLoginModel model)
        {
            ////var user = await _context.BctUsers
            ////        .Where(x => x.UserName == model.UserName)
            ////        .Join(
            ////            _context.BctUserCredentials,
            ////            user => user.BctUserId,
            ////            credentials => credentials.BctUserId,
            ////            (user, credentials) => user
            ////        ).Where(credentials => credentials.Password == model.Password).FirstOrDefaultAsync();
            var user = await _context.BctUsers.Where(x => x.UserName == model.UserName && x.Status == Status.Active)
                        .Join(_context.BctUserCredentials, user => user.BctUserId, credentials => credentials.BctUserId,
                            (user, credentials) => new { User = user, Credentials = credentials }).Where(joined => joined.Credentials.Password == model.Password)
                                .Select(joined => joined.User)
                                .FirstOrDefaultAsync();
            return user;
            //return await _context.BctUsers.FirstOrDefaultAsync(x => x.UserName == model.UserName && x.Password == model.Password && x.IsActive==true);
        }
        public async Task<BctUser> GetUserByUserIdAndPassword(int userId, string password)
        {
            ////var user = await _context.BctUsers
            ////        .Where(x => x.UserName == model.UserName)
            ////        .Join(
            ////            _context.BctUserCredentials,
            ////            user => user.BctUserId,
            ////            credentials => credentials.BctUserId,
            ////            (user, credentials) => user
            ////        ).Where(credentials => credentials.Password == model.Password).FirstOrDefaultAsync();
            var user = await _context.BctUsers.Where(x => x.BctUserId == userId)
                        .Join(_context.BctUserCredentials, user => user.BctUserId, credentials => credentials.BctUserId,
                            (user, credentials) => new { User = user, Credentials = credentials }).Where(joined => joined.Credentials.Password == password)
                                .Select(joined => joined.User)
                                .FirstOrDefaultAsync();
            return user;
            //return await _context.BctUsers.FirstOrDefaultAsync(x => x.UserName == model.UserName && x.Password == model.Password && x.IsActive==true);
        }

        /// <summary>
        /// this method to get user data by passing username
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public async Task<BctUser> GetDataByUserName(string userName)
        {
            return await _context.BctUsers.FirstOrDefaultAsync(x => x.UserName.Equals(userName));

        }
        /// <summary>
        /// this method to check username exist or not
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public async Task<bool> IsUserNameExist(string userName)
        {
            return await _context.BctUsers.AnyAsync(x => x.UserName.Equals(userName));

        }
        /// <summary>
        /// this method to check username exist or not
        /// </summary>
        /// <param name="mobileNumbetr,countryCode,email"></param>
        /// <returns></returns>
        public async Task<bool> IsMobileEmailExist(string mobileNumbetr, string countryCode, string email)
        {
            return await _context.BctUsers.AnyAsync(x => x.EmailId == email || (x.MobileNumber == mobileNumbetr && x.CountryCode == countryCode));

        }
        ///// <summary>
        ///// this methos to get user data based on Mobile number
        ///// </summary>
        ///// <param name="mobileNumber"></param>
        ///// <returns></returns>
        //public async Task<BctUsers> GetUserByMobileNumber(string mobileNumber)
        //{
        //    return await _context.BctUsers.FirstOrDefaultAsync(x => x.MobileNumber.Equals(mobileNumber));
        //}
        public async Task<BctUser> UpdateUserAsync(BctUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
            _ = await _context.SaveChangesAsync();
            return user;
        }

        public async Task<BctUser> GetUsersByEmailId(string emailId)
        {
            return await _context.BctUsers.FirstOrDefaultAsync(x => x.EmailId.Equals(emailId));

        }
        public async Task<BctUser> GetUserByMobileNumber(string countryCode, string mobileNumber)
        {
            return await _context.BctUsers.FirstOrDefaultAsync(x => x.CountryCode.Equals(countryCode) && x.MobileNumber.Equals(mobileNumber));

        }
        public async Task<bool> IsRegexUserExist()
        {
            return await _context.BctUsers.Where(x => x.Status == Status.Active && x.UserType == BCTUserType.RegexUser).AnyAsync();
        }
    }
}
