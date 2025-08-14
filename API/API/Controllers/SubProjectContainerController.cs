using API.Services;
using AutoMapper;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Shared.Enums;
using ViewModels;
using ViewModels.Shared;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class SubProjectContainerController : BaseController
    {
        private readonly ISubProjectContainerService _service;
        public SubProjectContainerController(ISubProjectContainerService service, IMapper mapper, IHttpContextAccessor httpContextAccessor, ICommonService commonService)
            : base(mapper, httpContextAccessor, commonService)
        {
            _service = service;
        }

        [Route("CreateOrModify")]
        [HttpPost]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        public async Task<CommonEntityResponse> CreateOrModifyAsync([FromForm] SubProjectContainerPostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                if (model.ProjectId == 0)
                {
                    response.CreateFailureResponse("Project Id required");
                    return response;
                }
                if (model.SubProjectContainerId == 0 && model.ImageFile == null)
                {
                    response.CreateFailureResponse("Image file required");
                    return response;
                }

                response = await _service.CreateOrModify(model);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/SubProjectContainer/CreateOrModify";
                log.ApiType = ApiType.Post;
                log.Parameters = "form-data";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        [Route("List/{ProjectId}")]
        [HttpGet]
        [ProducesResponseType(typeof(ModelEntityResponse<List<SubProjectContainerViewModel>>), 200)]
        public async Task<ModelEntityResponse<List<SubProjectContainerViewModel>>> List(int ProjectId)
        {
            ModelEntityResponse<List<SubProjectContainerViewModel>> response = new();
            try
            {
                response = await _service.GetAll(ProjectId);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/SubProjectContainer/List";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        [Route("Details/{id}")]
        [HttpGet]
        [ProducesResponseType(typeof(ModelEntityResponse<SubProjectContainerViewModel>), 200)]
        public async Task<ModelEntityResponse<SubProjectContainerViewModel>> Details(int id)
        {
            ModelEntityResponse<SubProjectContainerViewModel> response = new();
            try
            {
                response = await _service.GetDetails(id);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/SubProjectContainer/Details/{id}";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"id={id}";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        [Route("Delete/{SubProjectContainerId}")]
        [HttpPost]
        [ProducesResponseType(typeof(ModelEntityResponse<CommonEntityResponse>), 200)]
        public async Task<CommonEntityResponse> deleteProjectContainers(int SubProjectContainerId)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                response = await _service.DeleteSubProjectContainer(SubProjectContainerId);
            }
            catch (Exception e)
            {

                response.CreateFailureResponse(CommonData.ErrorMessage); ;
                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Container/List";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"";
                //log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        [Route("SubProject/Delete/{SubProjectId}")]
        [HttpPost]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        public async Task<CommonEntityResponse> deleteProject(int SubProjectId)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                response = await _service.DeleteSubProject(SubProjectId);
            }
            catch (Exception e)
            {

                response.CreateFailureResponse(CommonData.ErrorMessage); ;
                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Project/Delete";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"";
                //log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
    }
} 