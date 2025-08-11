using API.Helpers;
using AutoMapper;
using Core.Models;
using Repository;
using Repository.Shared;
using System.ComponentModel;
using System.Reflection;
using ViewModels;
using ViewModels.Shared;

namespace API.Services
{
    public interface IProjectContainerService
    {
        Task<CommonEntityResponse> CreateOrModifyProjectContainer(ProjectContainerPostModel model);
        Task<ModelEntityResponse<List<ProjectContainerViewModel>>> GetAllContainers();
        Task<ModelEntityResponse<ProjectContainerDetailsViewModel>> GetContainerDetails(int ProjectContainerId);
        Task<ModelEntityResponse<List<ProjectContainerDetailsViewModel>>> GetAllContainerDetails();
        Task<CommonEntityResponse> DeleteProject(int ProjectId);

    }
    public class ProjectContainerService : IProjectContainerService
    {
        readonly IMapper _mapper;
        readonly IWebHostEnvironment _env;
        readonly IUnitOfWork _unitOfWork;
        readonly IMedia _media;
        readonly IEncryptor _encryptor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ProjectContainerService(IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment env, IMedia media, IEncryptor encryptor, IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _env = env;
            _media = media;
            _encryptor = encryptor;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<CommonEntityResponse> CreateOrModifyProjectContainer(ProjectContainerPostModel model)
        {
            //Uploading Files 
            string BackgroundImageFileName = string.Empty;
            string ContainorOldImageURL = "";
            List<string> ProjectContainorOldImageURL = new List<string>();
            if (model.ImageFile != null)
            {
                BackgroundImageFileName = await _media.SaveFile(CommonData.ProjectContainerPath, model.ImageFile);
            }

            CommonEntityResponse response = new CommonEntityResponse();
            ProjectContainer? container = new ProjectContainer();
            if (model.ProjectContainerId != 0)
            {
                //modify existing
                container = await _unitOfWork.ProjectContainers.GetById(model.ProjectContainerId);
                if (model.ImageFile != null)
                {
                    // for removing old image from directory
                    ContainorOldImageURL = container.BackgroundImageFileName;
                    container.BackgroundImageFileName = BackgroundImageFileName;
                }
                container.Title = model.Title;
                container.UpdatedDate = DateTime.UtcNow;
            }

            else
            {
                //add new
                container = _mapper.Map<ProjectContainerPostModel, ProjectContainer>(model);
                container.BackgroundImageFileName = BackgroundImageFileName;
                container.CreatedDate = DateTime.UtcNow;
                container.UpdatedDate = DateTime.UtcNow;
            }
            using (var transaction = _unitOfWork._context.Database.BeginTransaction())
            {
                try
                {
                    int cantainerId = await _unitOfWork.ProjectContainers.CreateOrModify(container);
                    Project project = new Project();
                    foreach (var item in model.Projects)
                    {
                        string ProjectImageFileName = "";
                        if (item.ProjectId == 0)
                        {
                            project = _mapper.Map<ProjectPostModel, Project>(item);
                            project.ProjectContainerId = cantainerId;
                            ProjectImageFileName = await _media.SaveFile(CommonData.ProjectPath, item.ImageFile);
                            project.ImageFileName = ProjectImageFileName;
                        }
                        else
                        {
                            // modify existing project
                            project = await _unitOfWork.Projects.GetById(item.ProjectId);
                            project.XPosition = item.XPosition;
                            project.YPosition = item.YPosition;
                            project.HeightPercent = item.HeightPercent;
                            project.Animation = item.Animation;
                            project.AnimationSpeed = item.AnimationSpeed;
                            project.AnimationTrigger = item.AnimationTrigger;
                            project.IsExterior = item.IsExterior;

                            if (item.ImageFile != null)
                            {
                                ProjectImageFileName = await _media.SaveFile(CommonData.ProjectPath, item.ImageFile);

                                ProjectContainorOldImageURL.Add(project.ImageFileName);
                                project.ImageFileName = ProjectImageFileName;
                            }

                        }
                        await _unitOfWork.Projects.CreateOrModify(project);

                    }

                    transaction.Commit();
                    response.CreateSuccessResponse("Project container created successfully");
                    if (!string.IsNullOrWhiteSpace(ContainorOldImageURL))
                    {
                        string url = Path.Combine(CommonData.ProjectContainerPath, ContainorOldImageURL);
                        _media.RemoveFile(url);
                    }
                    if(ProjectContainorOldImageURL.Count > 0)
                    {
                        foreach (var item in ProjectContainorOldImageURL)
                        {
                            string url = Path.Combine(CommonData.ProjectPath, item);
                            _media.RemoveFile(url);
                        }
                    }
                    response.EntityId = cantainerId;
                }
                catch (Exception ex)
                {
                    response.CreateFailureResponse();
                    Console.WriteLine($"Error: {ex.Message}");

                    transaction.Rollback();
                    string url = Path.Combine(CommonData.ProjectContainerPath, container.BackgroundImageFileName);
                    _media.RemoveFile(url);
                }
            }
            return response;
        }

        public async Task<CommonEntityResponse> DeleteProject(int ProjectId)
        {
            CommonEntityResponse res = new CommonEntityResponse();
            await _unitOfWork.Projects.DeleteProject(ProjectId);
            res.CreateSuccessResponse();
            return res;
        }

        public async Task<ModelEntityResponse<List<ProjectContainerViewModel>>> GetAllContainers()
        {
            ModelEntityResponse<List<ProjectContainerViewModel>> res = new ModelEntityResponse<List<ProjectContainerViewModel>>();
            var containers = await _unitOfWork.ProjectContainers.GetAll();
            res.Data = _mapper.Map<List<ProjectContainerViewModel>>(containers);
            foreach (var item in res.Data)
            {
                item.BackgroundImageUrl = CommonData.GetProjectContainerUrl(item.BackgroundImageFileName);
            }
            return res;
        }

        public async Task<ModelEntityResponse<ProjectContainerDetailsViewModel>> GetContainerDetails(int ProjectContainerId)
        {
            ModelEntityResponse<ProjectContainerDetailsViewModel> res = new ModelEntityResponse<ProjectContainerDetailsViewModel>();
            var container = await _unitOfWork.ProjectContainers.GetById(ProjectContainerId);
            res.Data = _mapper.Map<ProjectContainerDetailsViewModel>(container);
            res.Data.BackgroundImageUrl = CommonData.GetProjectContainerUrl(res.Data.BackgroundImageFileName);
            var projects = await _unitOfWork.Projects.GetByProjectContainerId(ProjectContainerId);
            res.Data.Projects = _mapper.Map<List<ProjectViewModel>>(projects);
            foreach (var item in res.Data.Projects)
            {
                item.ProjectImageUrl = CommonData.GetProjectUrl(item.ImageFileName);
            }
            return res;
        }

        public async Task<ModelEntityResponse<List<ProjectContainerDetailsViewModel>>> GetAllContainerDetails()
        {
            ModelEntityResponse<List<ProjectContainerDetailsViewModel>> res = new ModelEntityResponse<List<ProjectContainerDetailsViewModel>>();
            var containers = await _unitOfWork.ProjectContainers.GetAll();
            var result = new List<ProjectContainerDetailsViewModel>();
            foreach (var c in containers)
            {
                var vm = _mapper.Map<ProjectContainerDetailsViewModel>(c);
                vm.BackgroundImageUrl = CommonData.GetProjectContainerUrl(vm.BackgroundImageFileName);
                var projects = await _unitOfWork.Projects.GetByProjectContainerId(c.ProjectContainerId);
                vm.Projects = _mapper.Map<List<ProjectViewModel>>(projects);
                foreach (var p in vm.Projects)
                {
                    p.ProjectImageUrl = CommonData.GetProjectUrl(p.ImageFileName);
                }
                result.Add(vm);
            }
            res.Data = result;
            res.CreateSuccessResponse();
            return res;
        }
    }
}
