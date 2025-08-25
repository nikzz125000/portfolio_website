using API.Services;
using AutoMapper;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared.Enums;
using ViewModels;
using ViewModels.Shared;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : BaseController
    {
        private readonly ISettingService _settingService;

        public SettingsController(ISettingService settingService, IMapper mapper, IHttpContextAccessor httpContextAccessor, ICommonService commonService)
            : base(mapper, httpContextAccessor, commonService)
        {
            _settingService = settingService;
        }

        [Route("Scroll/CreateOrModify")]
        [HttpPost]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        [Authorize]
        public async Task<CommonEntityResponse> CreateOrModifyScrollSettingsAsync([FromBody] ScrollSettingsPostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                response = await _settingService.CreateOrModifyScrollSetting(model);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Settings/Scroll/CreateOrModify";
                log.ApiType = ApiType.Post;
                log.Parameters = "form-data";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        [Route("Scroll/Details")]
        [HttpGet]
        [ProducesResponseType(typeof(ModelEntityResponse<ScrollSettingsViewModel>), 200)]
        public async Task<ModelEntityResponse<ScrollSettingsViewModel>> GetDetails()
        {
            ModelEntityResponse<ScrollSettingsViewModel> response = new ModelEntityResponse<ScrollSettingsViewModel>();
            try
            {
                //getCurrentUser();
                response = await _settingService.GetScrollSettingById();
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Settings/Scroll/Details";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
        [Route("Padding/CreateOrModify")]
        [HttpPost]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        [Authorize]
        public async Task<CommonEntityResponse> CreateOrModifyPaddingAsync([FromBody] PaddingSettingsPostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                response = await _settingService.CreateOrModifyPaddingSettings(model);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Settings/Padding/CreateOrModify";
                log.ApiType = ApiType.Post;
                log.Parameters = "form-data";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        [Route("Padding/Details")]
        [HttpGet]
        [ProducesResponseType(typeof(ModelEntityResponse<PaddingSettingsViewModel>), 200)]
        public async Task<ModelEntityResponse<PaddingSettingsViewModel>> GetPaddingDetails()
        {
            ModelEntityResponse<PaddingSettingsViewModel> response = new ModelEntityResponse<PaddingSettingsViewModel>();
            try
            {
                //getCurrentUser();
                response = await _settingService.GetPaddingSettingById();
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Settings/Padding/Details";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
    }
}
