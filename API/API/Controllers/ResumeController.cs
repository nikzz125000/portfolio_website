using API.Services;
using AutoMapper;
using Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Shared.Enums;
using ViewModels.Shared;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController : BaseController
    {
        private readonly IResumeService _resumeService;

        public ResumeController(IResumeService resumeService, IMapper mapper, IHttpContextAccessor httpContextAccessor, ICommonService commonService)
            : base(mapper, httpContextAccessor, commonService)
        {
            _resumeService = resumeService;
        }

        [Route("CreateOrModify")]
        [HttpPost]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        public async Task<CommonEntityResponse> CreateOrModifyAsync([FromForm] ViewModels.ResumePostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                response = await _resumeService.CreateOrModify(model);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Resume/CreateOrModify";
                log.ApiType = ApiType.Post;
                log.Parameters = "form-data";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        [Route("Details/{id}")]
        [HttpGet]
        [ProducesResponseType(typeof(ModelEntityResponse<ViewModels.ResumeViewModel>), 200)]
        public async Task<ModelEntityResponse<ViewModels.ResumeViewModel>> GetDetails(int id)
        {
            ModelEntityResponse<ViewModels.ResumeViewModel> response = new ModelEntityResponse<ViewModels.ResumeViewModel>();
            try
            {
                response = await _resumeService.GetById(id);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Resume/Details/{id}";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"id={id}";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
    }
} 