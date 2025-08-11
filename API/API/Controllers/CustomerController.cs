using API.Services;
using AutoMapper;
using Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared.Enums;
using ViewModels;
using ViewModels.Shared;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : BaseController
    {
        readonly IProjectContainerService _containerService;
        readonly ISubProjectContainerService _iSubProjectContainerService;
        public CustomerController(IProjectContainerService containerService, ISubProjectContainerService subProjectContainerService, IMapper mapper, IHttpContextAccessor httpContextAccessor, ICommonService commonService) : base(mapper, httpContextAccessor, commonService)
        {
            _containerService = containerService;
            _iSubProjectContainerService = subProjectContainerService;
        }
        
        [Route("ProjectContainer/List/Details")]
        [HttpGet]
        [ProducesResponseType(typeof(ModelEntityResponse<List<ProjectContainerDetailsViewModel>>), 200)]
        public async Task<ModelEntityResponse<List<ProjectContainerDetailsViewModel>>> ListProjectContainersWithDetails()
        {
            ModelEntityResponse<List<ProjectContainerDetailsViewModel>> response = new ModelEntityResponse<List<ProjectContainerDetailsViewModel>>();
            try
            {
                response = await _containerService.GetAllContainerDetails();
            }
            catch (Exception e)
            {

                response.CreateFailureResponse(CommonData.ErrorMessage); ;
                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Container/List/Details";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"";
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        [Route("SubProjectContainer/List/Details/{ProjectId}")]
        [HttpGet]
        [ProducesResponseType(typeof(ModelEntityResponse<List<SubProjectContainerDetailsViewModel>>), 200)]
        public async Task<ModelEntityResponse<List<SubProjectContainerDetailsViewModel>>> ListSubProjectContainersWithDetails(int ProjectId)
        {
            ModelEntityResponse<List<SubProjectContainerDetailsViewModel>> response = new ModelEntityResponse<List<SubProjectContainerDetailsViewModel>>();
            try
            {
                response = await _iSubProjectContainerService.GetAllSubContainerDetails(ProjectId);
            }
            catch (Exception e)
            {

                response.CreateFailureResponse(CommonData.ErrorMessage); ;
                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Customer/SubProjectContainer/List/Details";
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
