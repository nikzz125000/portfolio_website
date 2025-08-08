using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Core.DB;
using Core.Models;
using Dapper;
using Microsoft.Data.SqlClient;

namespace Repository.Shared
{
    public abstract class BaseRepository<TEntity> : IRepository<TEntity> where TEntity : WebSiteEntity
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<TEntity> _entities;
        protected readonly IConfiguration _config;

        public BaseRepository(IConfiguration config, ApplicationDbContext context)
        {
            _context = context;
            _config = config;
            _entities = context.Set<TEntity>();
        }

        public virtual IQueryable<TEntity> Table => Entities;

        public virtual IQueryable<TEntity> TableNoTracking => Entities.AsNoTracking();

        public virtual DbSet<TEntity> Entities => _entities;

        public virtual async Task AddAsync(TEntity entity)
        {
            await _entities.AddAsync(entity);
        }

        public virtual async Task AddRangeAsync(IEnumerable<TEntity> entities)
        {
            await _entities.AddRangeAsync(entities);
        }


        public virtual async Task UpdateAsync(TEntity entity)
        {
            await Task.Run(() => _entities.Update(entity));
        }

        public virtual async Task UpdateRangeAsync(IEnumerable<TEntity> entities)
        {
            await Task.Run(() => _entities.UpdateRange(entities));
        }

        public virtual async Task RemoveAsync(TEntity entity)
        {
            await Task.Run(() => _entities.Remove(entity));
        }

        public virtual async Task RemoveRangeAsync(IEnumerable<TEntity> entities)
        {
            await Task.Run(() => _entities.RemoveRange(entities));
        }

        public virtual async Task<int> CountAsync()
        {
            return await _entities.CountAsync();
        }


        public virtual async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _entities.Where(predicate).ToListAsync();
        }

        public virtual async Task<TEntity> GetFirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _entities.FirstOrDefaultAsync(predicate);
        }

        public virtual async Task<TEntity> GetAsync(int id)
        {
            return await _entities.FindAsync(id);
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _entities.ToListAsync();
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _entities.Where(predicate).ToListAsync();
        }

        //public async Task RemoveRangeAsync(IEnumerable<int> ids)
        //{
        //    await _entities.Where(x => ids.Contains(x.Id)).DeleteAsync();
        //}

        public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _entities.AnyAsync(predicate);
        }

        public async Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _entities.CountAsync(predicate);
        }

        //dapper

        
        protected IDbConnection CreateConnection()
        {
            // Using SqlConnection instead of NpgsqlConnection
            var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return connection;
        }
        public IDbConnection GetDbConnection()
        {
            return CreateConnection();
        }


        public T QueryFirstOrDefault<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = CreateConnection())
            {
                return connection.QueryFirstOrDefault<T>(sql, parameters);
            }
        }

        public List<T> Query<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = CreateConnection())
            {
                connection.Open();
                return connection.Query<T>(sql, parameters).ToList();
            }
        }

        public int Execute(string sql, object parameters = null)
        {
            using (IDbConnection connection = CreateConnection())
            {
                connection.Open();
                return connection.Execute(sql, parameters);
            }
        }

        public async Task<T?> QueryFirstOrDefaultAsync<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<T>(sql, parameters);
            }
        }

        public async Task<List<T>> QueryAsync<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<T>(sql, parameters)).ToList();
                return (await connection.QueryAsync<T>(sql, parameters)).ToList();
            }
        }

        public async Task<int> ExecuteAsync(string sql, object parameters = null)
        {
            using (IDbConnection connection = CreateConnection())
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, parameters);
            }
        }



        public async Task<int> ExecuteScalarAsync(string sql, object parameters = null)
        {
            using (IDbConnection connection = CreateConnection())
            {
                connection.Open();
                return await connection.ExecuteScalarAsync<int>(sql, parameters);
            }
        }
        public async Task<decimal> ExecuteScalareDecimalAsync(string sql, object parameters = null)
        {
            using (IDbConnection connection = CreateConnection())
            {
                connection.Open();
                object result = await connection.ExecuteScalarAsync(sql, parameters);
                if (result != DBNull.Value && result != null)
                {
                    return Convert.ToDecimal(result);
                }
                else
                {
                    // Handle the case where the result is null or DBNull
                    return 0.00m; // or any other appropriate default value
                }
            }
        }

        protected (string countQuery, string query) GetPagingQueries(string query, int pageIndex, int pageSize)
        {
            var countQuery = GetCountQuery(query);
            try
            {
                var pagedQuery = GetPagingQuery(query, pageIndex, pageSize);
                return (countQuery, pagedQuery);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return ("", "");
        }

        //private string GetCountQuery(string query)
        //{
        //    var orderbyIndex = query.IndexOf(@"Order by ", StringComparison.CurrentCultureIgnoreCase);
        //    return $"Select Count(*) as Count From ({query.Substring(0, orderbyIndex)}) as A";
        //}
        private string GetCountQuery(string query)
        {
            var orderbyIndex = query.IndexOf("Order by ", StringComparison.CurrentCultureIgnoreCase);

            // If there is no "Order by" clause, handle it to avoid an exception
            if (orderbyIndex == -1)
            {
                return $"SELECT COUNT(*) as Count FROM ({query}) AS A";
            }

            return $"SELECT COUNT(*) as Count FROM ({query.Substring(0, orderbyIndex)}) AS A";
        }

        //protected string GetPagingQuery(string query, int pageIndex, int pageSize)
        //{
        //    query += $" OFFSET {(pageIndex - 1) * pageSize} ROWS FETCH NEXT {pageSize} ROWS ONLY";
        //    return query;
        //}
        protected string GetPagingQuery(string query, int pageIndex, int pageSize)
        {
            // PostgreSQL uses LIMIT and OFFSET for pagination
            query += $" OFFSET {(pageIndex - 1) * pageSize} LIMIT {pageSize}";
            return query;
        }

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



        public async Task<int> ExecuteAsync(IDbConnection connection, string sql, object parameters = null, IDbTransaction transaction = null)
        {
            return await connection.ExecuteAsync(sql, parameters, transaction: transaction);
        }

        public async Task<string> ExecuteScalarAsync(IDbConnection connection, string sql, object parameters = null, IDbTransaction transaction = null)
        {
            return await connection.ExecuteScalarAsync<string>(sql, parameters, transaction: transaction);
        }

        public Task RemoveRangeAsync(IEnumerable<int> ids)
        {
            throw new NotImplementedException();
        }

        //public Task<IEnumerable<TEntity>> GetAllAsync(DataSourceVendorRequestModel model)
        //{
        //    throw new NotImplementedException();
        //}

       
    }

}

