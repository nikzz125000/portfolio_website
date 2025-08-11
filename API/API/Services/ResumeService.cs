using Core.Models;
using Repository;
using ViewModels.Shared;
using ViewModels;
using API.Helpers;
using API;

namespace API.Services
{
    public interface IResumeService
    {
        Task<CommonEntityResponse> CreateOrModify(ResumePostModel model);
        Task<ModelEntityResponse<ResumeViewModel>> GetById();
    }

    public class ResumeService : IResumeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMedia _media;

        public ResumeService(IUnitOfWork unitOfWork, IMedia media)
        {
            _unitOfWork = unitOfWork;
            _media = media;
        }

        public async Task<CommonEntityResponse> CreateOrModify(ResumePostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                Resume entity;
                if (model.Id != 0)
                {
                    entity = await _unitOfWork.Resumes.GetById() ?? new Resume();
                }
                else
                {
                    entity = new Resume();
                    entity.CreatedAt = DateTime.UtcNow;
                }

                // Map simple fields
                entity.Name = model.Name;
                entity.Phone = model.Phone;
                entity.Email = model.Email;
                entity.Bio = model.Bio ?? string.Empty;
                entity.Location = model.Location ?? string.Empty;
                entity.Focus = model.Focus ?? string.Empty;
                entity.LinkedinUrl = model.LinkedinUrl ?? string.Empty;
                entity.InstagramUrl = model.InstagramUrl ?? string.Empty;
                entity.BehanceUrl = model.BehanceUrl ?? string.Empty;
                entity.WebsiteUrl = model.WebsiteUrl ?? string.Empty;
                entity.EducationJson = model.EducationJson ?? "[]";
                entity.ExperienceJson = model.ExperienceJson ?? "[]";
                entity.SkillsJson = model.SkillsJson ?? "[]";

                // Handle photo upload if provided
                if (model.Photo != null)
                {
                    var fileName = await _media.SaveFile(CommonData.PhotoPath, model.Photo);
                    entity.Photo = fileName;
                }

                entity.UpdatedAt = DateTime.UtcNow;

                int id = await _unitOfWork.Resumes.CreateOrModify(entity);
                response.EntityId = id;
                response.CreateSuccessResponse("Resume saved successfully");
            }
            catch (Exception)
            {
                response.CreateFailureResponse("Failed to save resume");
            }
            return response;
        }

        public async Task<ModelEntityResponse<ResumeViewModel>> GetById()
        {
            ModelEntityResponse<ResumeViewModel> response = new ModelEntityResponse<ResumeViewModel>();
            var data = await _unitOfWork.Resumes.GetById();
            if (data is not null)
            {
                response.Data = new ResumeViewModel
                {
                    Id = data.Id,
                    Name = data.Name,
                    Phone = data.Phone,
                    Email = data.Email,
                    Photo = string.IsNullOrWhiteSpace(data.Photo) ? string.Empty : CommonData.GetPhotoUrl(data.Photo),
                    Bio = data.Bio,
                    Location = data.Location,
                    Focus = data.Focus,
                    LinkedinUrl = data.LinkedinUrl,
                    InstagramUrl = data.InstagramUrl,
                    BehanceUrl = data.BehanceUrl,
                    WebsiteUrl = data.WebsiteUrl,
                    EducationJson = data.EducationJson,
                    ExperienceJson = data.ExperienceJson,
                    SkillsJson = data.SkillsJson
                };
                response.CreateSuccessResponse();
            }
            else
            {
                response.CreateFailureResponse("Resume not found");
            }
            return response;
        }
    }
} 