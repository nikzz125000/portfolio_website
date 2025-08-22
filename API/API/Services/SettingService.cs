using API.Helpers;
using Core.Models;
using Repository;
using ViewModels;
using ViewModels.Shared;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API.Services
{
    public interface ISettingService
    {
        Task<CommonEntityResponse> CreateOrModify(ScrollSettingsPostModel model);
        Task<ModelEntityResponse<ScrollSettingsViewModel>> GetById();
    }
    public class SettingService : ISettingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMedia _media;
        IEmailSender _emailSender;
        public SettingService(IUnitOfWork unitOfWork, IMedia media, IEmailSender emailSender)
        {
            _unitOfWork = unitOfWork;
            _media = media;
            _emailSender = emailSender;
        }


        public async Task<CommonEntityResponse> CreateOrModify(ScrollSettingsPostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                ScrollSetting entity;

                entity = await _unitOfWork.ScrollSettings.GetById();
                if (entity == null)
                {
                    entity = new ScrollSetting();
                }

                // Map simple fields
                entity.Smoothness = model.Smoothness;
                entity.Keyboard = model.Keyboard;
                entity.Momentum = model.Momentum;
                entity.Touch = model.Touch;
                entity.Wheel = model.Wheel;

                entity.UpdatedDate= DateTime.UtcNow;

                int id = await _unitOfWork.ScrollSettings.CreateOrModify(entity);
                response.EntityId = id;
                response.CreateSuccessResponse("Scroll settings saved successfully");
            }
            catch (Exception)
            {
                response.CreateFailureResponse("Failed to save scroll settings");
            }
            return response;
        }

        public async Task<ModelEntityResponse<ScrollSettingsViewModel>> GetById()
        {
            ModelEntityResponse<ScrollSettingsViewModel> response = new ModelEntityResponse<ScrollSettingsViewModel>();
            var data = await _unitOfWork.ScrollSettings.GetById();
            if (data is not null)
            {
                response.Data = new ScrollSettingsViewModel
                {
                    ScrollSettingsId = data.ScrollSettingId,
                    Smoothness = data.Smoothness,
                    Keyboard=data.Keyboard,
                    Momentum = data.Momentum,
                    Touch = data.Touch,
                    Wheel = data.Wheel
                };
                response.CreateSuccessResponse();
            }
            else
            {
                response.CreateFailureResponse("Settings not found");
            }
            return response;
        }
    }
}
