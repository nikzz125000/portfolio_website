using Core.DB;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;

namespace Repository.Services
{
    public class ResumeRepository : IResumeRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public ResumeRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<int> CreateOrModify(Resume model)
        {
            if (model.Id != 0)
            {
                _context.Resumes.Update(model);
            }
            else
            {
                _context.Resumes.Add(model);
            }
            await _context.SaveChangesAsync();
            return model.Id;
        }

        public async Task<Resume?> GetById(int id)
        {
            return await _context.Resumes.FindAsync(id);
        }
    }
} 