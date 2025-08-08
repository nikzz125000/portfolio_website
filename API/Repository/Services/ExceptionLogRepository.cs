using Core.DB;
using Core.Models;
using Repository.Interfaces;
using Repository.Shared;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels.Shared;
using ViewModels;

namespace Repository.Services
{
    public class ExceptionLogRepository : BaseRepository<ExceptionLog>, IExceptionLogRepository
    {
        readonly ApplicationDbContext _context;
        readonly IConfiguration _config;
        public ExceptionLogRepository(ApplicationDbContext context, IConfiguration config) : base(config, context)
        {
            _context = context;
            _config = config;
        }
        public async Task<bool> Create(ExceptionLog model)
        {
            try
            {
                _context.ExceptionLogs.Add(model);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex) { 
                return false;
            }
        }
        public async Task<IPagedList<ExceptionLogViewModel>> GetAllPaged(ExceptionLogRequestModel Model)
        {
            ModelEntityResponse<IPagedList<List<ExceptionLogViewModel>>> response = new ModelEntityResponse<IPagedList<List<ExceptionLogViewModel>>>();
            string query = $@"select el.exception_log_id as ExceptionLogId,
                                el.api_type as ApiType,
                                el.api  as Api,
                                el.vendor_user_id as vendor_user_id,
                                el.parameters as parameters ,
                                el.message as Message,
                                el.stack_trace  as StackTrace,
                                el.created_date  as CreatedDate,
                                el.updated_date as UpdatedDate 
                                from exception_log el 
                                ";
            string whereQuery = "where 1=1";
            if (!string.IsNullOrEmpty(Model.ApiName))
            {
                whereQuery += $@" and el.api ilike '%{Model.ApiName}%'";
            }

            string orderQuery = " ORDER BY el.exception_log_id desc";
            // whereQuery = (whereQuery == "where" ? "" : whereQuery);
            string finalQuery = $@"{query} {whereQuery} {orderQuery}";
            var queries = GetPagingQueries(finalQuery, Model.Page, Model.PageSize);
            var count = await ExecuteScalarAsync(queries.countQuery);
            var data = await QueryAsync<ExceptionLogViewModel>(queries.query);
            return new DapperPagedList<ExceptionLogViewModel>(data, count, Model.Page, Model.PageSize);

        }
    }
}
