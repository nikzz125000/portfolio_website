using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Core.Models;

namespace Core.DB
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<BctUser> BctUsers { get; set; }
        public DbSet<BctUserCredential> BctUserCredentials { get; set; }
        
        public DbSet<ExceptionLog> ExceptionLogs { get; set; }
        public DbSet<SessionResetPassword> SessionResetPasswords { get; set; }

        public DbSet<Container> Containers { get; set; }
        public DbSet<Project> Projects { get; set; }
    }
}
