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
    public interface IContainerService
    {
        Task<CommonEntityResponse> CreateOrModifyContainer(ProjectContainerPostModel model);
    }
    public class ProjectContainerService : IContainerService
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
        public async Task<CommonEntityResponse> CreateOrModifyContainer(ProjectContainerPostModel model)
        {
            //Uploading Files 
            string fileUrl = string.Empty;
            string OldImageURL = "";

            if (model.ImageFile != null)
            {
                fileUrl = await _media.SaveFile(CommonData.ProjectContainerPath, model.ImageFile);
            }

            CommonEntityResponse response = new CommonEntityResponse();
            ProjectContainer? container = new ProjectContainer();
            if (model.ContainerId != 0)
            {
                //modify existing
                container = await _unitOfWork.ProjectContainers.GetById(model.ContainerId);
                if (model.ImageFile != null)
                {
                    // for removing old image from directory
                    OldImageURL = container.BackgroundImageFileName;
                    container.BackgroundImageFileName = fileUrl;
                }
                container.Title = model.Title;
                container.UpdatedDate = DateTime.UtcNow;
            }

            else
            {
                //add new
                container = _mapper.Map<ProjectContainerPostModel, ProjectContainer>(model);
                container.BackgroundImageFileName = fileUrl;
                container.CreatedDate = DateTime.UtcNow;
                container.UpdatedDate = DateTime.UtcNow;
            }
            using (var transaction = _unitOfWork._context.Database.BeginTransaction())
            {
                try
                {
                    //var Parameters = JsonConvert.SerializeObject(banner, Formatting.Indented);
                    int cantainerId = await _unitOfWork.ProjectContainers.CreateOrModify(container);
                    transaction.Commit();
                    response.CreateSuccessResponse("Project container created successfully");
                    if (!string.IsNullOrWhiteSpace(OldImageURL))
                    {
                        string url = Path.Combine(CommonData.ProjectContainerPath, OldImageURL);
                        _media.RemoveFile(url);
                    }
                    response.EntityId = cantainerId;
                }
                catch (Exception ex)
                {
                    response.CreateFailureResponse();
                    Console.WriteLine($"Error: {ex.Message}");

                    transaction.Rollback();
                    // remove added image
                    string url = Path.Combine(CommonData.ProjectContainerPath, container.BackgroundImageFileName);

                    _media.RemoveFile(url);
                }
            }
            return response;
        }
    }
}
