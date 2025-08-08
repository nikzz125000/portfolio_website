using API.Services;
using AutoMapper;
using Core.Models;
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
    public class ProjectContainerController : BaseController
    {
        readonly IProjectContainerService _containerService;
        public ProjectContainerController(IProjectContainerService containerService, IMapper mapper, IHttpContextAccessor httpContextAccessor, ICommonService commonService) : base(mapper, httpContextAccessor, commonService)
        {
            _containerService = containerService;
        }

        [Route("CreateOrModify")]
        [HttpPost]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        public async Task<CommonEntityResponse> CreateOrModifyAsync([FromForm] ProjectContainerPostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                
                if (model.ImageFile == null)
                {
                    response.CreateFailureResponse("Image file required");
                    return response;
                }

                response = await _containerService.CreateOrModifyProjectContainer(model);

            }
            catch (Exception e)
            {

                response.CreateFailureResponse(CommonData.ErrorMessage); ;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Container/CreateOrModify";
                log.ApiType = ApiType.Post;
                //log.Parameters = $@"";
                log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        [Route("List")]
        [HttpGet]
        [ProducesResponseType(typeof(ModelEntityResponse<List<ProjectContainerViewModel>>), 200)]
        public async Task<ModelEntityResponse<List<ProjectContainerViewModel>>> ListProjectContainers()
        {
            ModelEntityResponse<List<ProjectContainerViewModel>> response = new ModelEntityResponse<List<ProjectContainerViewModel>>();
            try
            {

                response = await _containerService.GetAllContainers();

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

        [Route("Details/{ProjectContainerId}")]
        [HttpGet]
        [ProducesResponseType(typeof(ModelEntityResponse<List<ProjectContainerDetailsViewModel>>), 200)]
        public async Task<ModelEntityResponse<ProjectContainerDetailsViewModel>> getProjectContainers(int ProjectContainerId)
        {
            ModelEntityResponse<ProjectContainerDetailsViewModel> response = new ModelEntityResponse<ProjectContainerDetailsViewModel>();
            try
            {
                response = await _containerService.GetContainerDetails(ProjectContainerId);

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
        [Route("Project/Delete/{ProjectContainerId}")]
        [HttpDelete]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        public async Task<CommonEntityResponse> deleteProject(int ProjectId)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                response = await _containerService.DeleteProject(ProjectId);
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
