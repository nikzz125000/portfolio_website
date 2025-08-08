using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Core.Models;

namespace Repository.Shared
{
    public interface IRepository<TEntity> : IDisposable where TEntity : WebSiteEntity
    {
        IQueryable<TEntity> Table { get; }
        IQueryable<TEntity> TableNoTracking { get; }
        DbSet<TEntity> Entities { get; }
        Task AddAsync(TEntity entity);
        Task AddRangeAsync(IEnumerable<TEntity> entities);
        Task UpdateAsync(TEntity entity);
        Task UpdateRangeAsync(IEnumerable<TEntity> entities);
        Task RemoveAsync(TEntity entity);
        Task RemoveRangeAsync(IEnumerable<TEntity> entities);
        Task RemoveRangeAsync(IEnumerable<int> ids);
        Task<int> CountAsync();
        Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate);
        Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate);
        Task<TEntity> GetFirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);
        Task<TEntity> GetAsync(int id);
        //Task<IEnumerable<TEntity>> GetAll(ViewModels.Shared.DataSourceVendorRequestModel model);
        Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate);
        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate);

        //Dapper
        T QueryFirstOrDefault<T>(string sql, object parameters = null);
        Task<T> QueryFirstOrDefaultAsync<T>(string sql, object parameters = null);
        List<T> Query<T>(string sql, object parameters = null);
        Task<List<T>> QueryAsync<T>(string sql, object parameters = null);
        int Execute(string sql, object parameters = null);
        Task<int> ExecuteAsync(string sql, object parameters = null);
        Task<int> ExecuteScalarAsync(string sql, object parameters = null);
        IDbConnection GetDbConnection();

        Task<int> ExecuteAsync(IDbConnection con, string sql, object parameters = null, IDbTransaction transaction = null);
        Task<string> ExecuteScalarAsync(IDbConnection connection, string sql, object parameters = null, IDbTransaction transaction = null);
        Task<decimal> ExecuteScalareDecimalAsync(string sql, object parameters = null);
    }
}
