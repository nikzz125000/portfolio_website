using API.Helpers;
using AutoMapper;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Repository;
using ViewModels;
using ViewModels.Shared;

namespace API.Services
{
    public interface ISubProjectContainerService
    {
        Task<CommonEntityResponse> CreateOrModify(SubProjectContainerPostModel model);
        Task<ModelEntityResponse<List<SubProjectContainerViewModel>>> GetAll(int ProjectId);
        Task<ModelEntityResponse<SubProjectContainerViewModel>> GetDetails(int subProjectContainerId);
    }

    public class SubProjectContainerService : ISubProjectContainerService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMedia _media;

        public SubProjectContainerService(IUnitOfWork unitOfWork, IMapper mapper, IMedia media)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _media = media;
        }

        public async Task<CommonEntityResponse> CreateOrModify(SubProjectContainerPostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();

            string backgroundImageFileName = string.Empty;
            string oldBackground = string.Empty;
            List<string> oldProjectImages = new();

            if (model.ImageFile != null)
            {
                backgroundImageFileName = await _media.SaveFile(CommonData.SubProjectContainerPath, model.ImageFile);
            }

            SubProjectContainer container;
            if (model.SubProjectContainerId != 0)
            {
                container = await _unitOfWork._context.SubProjectContainers.FindAsync(model.SubProjectContainerId);
                if (container == null)
                {
                    response.CreateFailureResponse("Container not found");
                    return response;
                }
                if (model.ImageFile != null)
                {
                    oldBackground = container.BackgroundImageFileName;
                    container.BackgroundImageFileName = backgroundImageFileName;
                }
                container.Title = model.Title;
                container.SortOrder = model.SortOrder;
                container.ProjectId = model.ProjectId;
                container.BackgroundImageAspectRatio = model.BackgroundImageAspectRatio;
                container.UpdatedDate = DateTime.UtcNow;
            }
            else
            {
                container = _mapper.Map<SubProjectContainerPostModel, SubProjectContainer>(model);
                container.BackgroundImageFileName = backgroundImageFileName;
                container.CreatedDate = DateTime.UtcNow;
                container.UpdatedDate = DateTime.UtcNow;
            }

            using var tx = _unitOfWork._context.Database.BeginTransaction();
            try
            {
                int containerId = await _unitOfWork.SubProjectContainers.CreateOrModify(container);

                foreach (var item in model.SubProjects)
                {
                    string projectImageFileName = string.Empty;
                    if (item.SubProjectId == 0)
                    {
                        var sub = _mapper.Map<SubProjectPostModel, SubProject>(item);
                        sub.SubProjectContainerId = containerId;
                        if (item.ImageFile != null)
                        {
                            projectImageFileName = await _media.SaveFile(CommonData.SubProjectPath, item.ImageFile);
                            sub.ImageFileName = projectImageFileName;
                        }
                        await _unitOfWork.SubProjects.CreateOrModify(sub);
                    }
                    else
                    {
                        var sub = await _unitOfWork._context.SubProjects.FindAsync(item.SubProjectId);
                        if (sub == null) continue;
                        sub.XPosition = item.XPosition;
                        sub.YPosition = item.YPosition;
                        sub.HeightPercent = item.HeightPercent;
                        sub.Animation = item.Animation;
                        sub.AnimationSpeed = item.AnimationSpeed;
                        sub.AnimationTrigger = item.AnimationTrigger;
                        sub.IsExterior = item.IsExterior;
                        if (item.ImageFile != null)
                        {
                            projectImageFileName = await _media.SaveFile(CommonData.SubProjectPath, item.ImageFile);
                            oldProjectImages.Add(sub.ImageFileName);
                            sub.ImageFileName = projectImageFileName;
                        }
                        await _unitOfWork.SubProjects.CreateOrModify(sub);
                    }
                }

                tx.Commit();
                response.CreateSuccessResponse("Sub project container saved successfully");
                response.EntityId = containerId;
                if (!string.IsNullOrWhiteSpace(oldBackground))
                {
                    _media.RemoveFile(Path.Combine(CommonData.SubProjectContainerPath, oldBackground));
                }
                foreach (var img in oldProjectImages)
                {
                    _media.RemoveFile(Path.Combine(CommonData.SubProjectPath, img));
                }
            }
            catch
            {
                tx.Rollback();
                if (!string.IsNullOrWhiteSpace(backgroundImageFileName))
                {
                    _media.RemoveFile(Path.Combine(CommonData.SubProjectContainerPath, backgroundImageFileName));
                }
                response.CreateFailureResponse();
            }

            return response;
        }

        public async Task<ModelEntityResponse<List<SubProjectContainerViewModel>>> GetAll(int ProjectId)
        {
            ModelEntityResponse<List<SubProjectContainerViewModel>> res = new();
            var containers = await _unitOfWork._context.SubProjectContainers.Where(x=>x.ProjectId == ProjectId).ToListAsync();
            res.Data = _mapper.Map<List<SubProjectContainerViewModel>>(containers);
            foreach (var item in res.Data)
            {
                item.BackgroundImageUrl = CommonData.GetSubProjectContainerUrl(item.BackgroundImageFileName);
            }
            return res;
        }

        public async Task<ModelEntityResponse<SubProjectContainerViewModel>> GetDetails(int subProjectContainerId)
        {
            ModelEntityResponse<SubProjectContainerViewModel> res = new();
            var container = await _unitOfWork._context.SubProjectContainers.FindAsync(subProjectContainerId);
            res.Data = _mapper.Map<SubProjectContainerViewModel>(container);
            res.Data.BackgroundImageUrl = CommonData.GetSubProjectContainerUrl(res.Data.BackgroundImageFileName);
            // Projects list can be added later when needed
            return res;
        }
    }
} 