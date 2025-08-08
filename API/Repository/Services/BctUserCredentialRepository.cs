using Core.DB;
using Core.Models;
using Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Services
{
    public class BctUserCredentialRepository : IBctUserCredentialRepository
    {
        readonly ApplicationDbContext _context;
        readonly IConfiguration _config;
        public BctUserCredentialRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<bool> CreateOrModify(BctUserCredential item)
        {
            if (item.BctUserCredentialId != 0)
            {
                //Upadte 
                _context.BctUserCredentials.Update(item);

            }
            else
            {
                //Add new
                _context.BctUserCredentials.Add(item);
            }
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<int> CreateAndGetId(BctUserCredential item)
        {
            _context.BctUserCredentials.Add(item);
            await _context.SaveChangesAsync();
            return item.BctUserCredentialId;
        }

        public async Task<bool> DeleteById(int BctUserCredentialId)
        {
            BctUserCredential? Credential = await _context.BctUserCredentials.FindAsync(BctUserCredentialId);
            if (Credential != null)
            {
                _context.BctUserCredentials.Remove(Credential);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public Task<List<BctUserCredential>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<BctUserCredential?> GetById(int BctUserCredentialId)
        {
            return await _context.BctUserCredentials.FindAsync(BctUserCredentialId);
        }
        public async Task<BctUserCredential> GetByUserId(int userId)
        {
            return await _context.BctUserCredentials.FirstOrDefaultAsync(x => x.BctUserId == userId);
        }
    }
}
