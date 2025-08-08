using Core.DB;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;
using Repository.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class UnitOfWork : IUnitOfWork
    {

        
        
        private IExceptionLogRepository _exceptionLog;
        private IBctUserRepository _bctUser;
        private IBctUserCredentialRepository _bctUserCredential;
        private ISessionResetPasswordRepository _sessionResetPassword;
        private IProjectContainerRepository _containers;
        private IProjectRepository _projects;


        public ApplicationDbContext _context { get; }
        private readonly IConfiguration _config;
        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public UnitOfWork(IConfiguration config, ApplicationDbContext context)
        {
            _context = context;
            _config = config;
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
        

        public IExceptionLogRepository ExceptionLogs
        {
            get
            {
                if (_exceptionLog == null)
                {
                    _exceptionLog = new ExceptionLogRepository(_context, _config);
                }
                return _exceptionLog;
            }
        }
        public IBctUserRepository BctUsers
        {
            get
            {
                if (_bctUser == null)
                {
                    _bctUser = new BctUserRepository(_context, _config);
                }
                return _bctUser;
            }
        }
        public IBctUserCredentialRepository BctUserCredentials
        {
            get
            {
                if (_bctUserCredential == null)
                {
                    _bctUserCredential = new BctUserCredentialRepository(_context, _config);
                }
                return _bctUserCredential;
            }
        }
        public ISessionResetPasswordRepository SessionResetPasswords
        {
            get
            {
                if (_sessionResetPassword == null)
                {
                    _sessionResetPassword = new SessionResetPasswordRepository(_context, _config);
                }
                return _sessionResetPassword;
            }
        }

        public IProjectContainerRepository ProjectContainers
        {
            get
            {
                if (_containers == null)
                {
                    _containers = new ContainerRepository(_context,_config);
                }
                return _containers;
            }
        }

        public IProjectRepository Projects
        {
            get
            {
                if (_projects == null)
                {
                    _projects = new ProjectRepository(_context,_config);
                }
                return _projects;
            }
        }

    }
}
