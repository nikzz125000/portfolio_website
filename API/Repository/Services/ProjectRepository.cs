using Core.DB;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;
using Repository.Shared;

namespace Repository.Services
{
    public class ProjectRepository : IProjectRepository
    {
        readonly ApplicationDbContext _context;
        readonly IConfiguration _config;
        public ProjectRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
    }
}
