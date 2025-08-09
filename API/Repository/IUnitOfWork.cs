using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.DB;
using Repository.Interfaces;
using Repository.Services;

namespace Repository
{
    public partial interface IUnitOfWork : IDisposable
    {
        ApplicationDbContext _context { get; }
        int SaveChanges();
        Task<int> SaveChangesAsync();
        
        IExceptionLogRepository ExceptionLogs { get; }
        IBctUserCredentialRepository BctUserCredentials { get; }
        IBctUserRepository BctUsers { get; }
        ISessionResetPasswordRepository SessionResetPasswords { get; }
        IProjectContainerRepository ProjectContainers { get; }
        IProjectRepository Projects { get; }
        IResumeRepository Resumes { get; }
        ISubProjectContainerRepository SubProjectContainers { get; }
        ISubProjectRepository SubProjects { get; }
    }
}
