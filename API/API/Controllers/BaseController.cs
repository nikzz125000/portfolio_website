using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Services;
using Core.Models;
using Repository.Shared;
using ViewModels;
using ViewModels.Shared;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly IMapper _mapper;
        private readonly ICommonService _commonService;

        public BaseController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ICommonService commonService)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            _commonService = commonService;
        }

        [ApiExplorerSettings(IgnoreApi = true)]

        public async Task<int> getCurrentUserID()
        {
            try
            {
                string userGUID = _httpContextAccessor?.HttpContext?.User?.Claims?.First(c => c.Type == "UserId")?.Value;
                int userID = int.Parse(userGUID);
                return userID;
            }
            catch (Exception e)
            {
                throw new Exception("Invalid client request");
            }
        }
        
       
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<BctUser> getCurrentUser()
        {
            string _userId = _httpContextAccessor?.HttpContext?.User?.Claims?.First(c => c.Type == "UserId")?.Value;
            //string decriptedUserId = await DecryptGUID(userGUID);

            return await _commonService.getCurrentUser(int.Parse(_userId));          
        }
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<bool> SaveExceptionLog(ExceptionLog model)
        {
            int userId = 0;
            string userGUID;
            try
            {
                userGUID = _httpContextAccessor?.HttpContext?.User?.Claims?.First(c => c.Type == "UserId")?.Value;
                userId = int.Parse(userGUID);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it in any other way
                Console.WriteLine($"An error occurred: {ex.Message}");
                // Set _userId to zero or any other default value
                userId = 0;
            }
            model.ExceptionType = "Master API";
            model.VendorUserId = userId;
            model.CreatedDate = DateTime.UtcNow;
            model.UpdatedDate = DateTime.UtcNow;
            return await _commonService.SaveExceptionLog(model);
        }
        [ApiExplorerSettings(IgnoreApi = true)]
        

        protected T PopulateResponseWithMap<T, U>(IPagedList data) where T : DataSourceResultModel<U>, new()
        {
            try
            {
                var response = new T
                {
                    //Data = Mapper.Map<U[]>(data),
                    Data = _mapper.Map<U[]>(data),
                    CurrentPage = data.PageIndex,
                    CurrentPageSize = data.PageSize,
                    HasNext = data.HasNextPage,
                    HasPreviousPage = data.HasPreviousPage,
                    Total = data.TotalCount
                };
                return response;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        protected T PopulateResponseWithoutMap<T, U>(IPagedList<U> data) where T : DataSourceResultModel<U>, new()
        {
            var response = new T
            {
                Data = data.ToArray(),
                CurrentPage = data.PageIndex,
                CurrentPageSize = data.PageSize,
                HasNext = data.HasNextPage,
                HasPreviousPage = data.HasPreviousPage,
                Total = data.TotalCount
            };
            return response;
        }

    }
}
