using AutoMapper;
using API.Helpers;
using Core.Models;
using ViewModels.Shared;
using ViewModels;
using System.Threading.Tasks;
using ViewModels.User;
using System;
using ViewModels.Auth;
using static IdentityServer4.Models.IdentityResources;
using Repository;

namespace API.Services
{
    public interface IBctUserService
    {
        Task<BctUser> GetUserByUserName(string userName);
        Task<CommonEntityResponse> ModifyUserDetails(BctUserUserIdRequestModal model, BctUser currentUser);
        Task<ModelEntityResponse<BctUserViewModel>> GetBctUserDetails(int BctUserId);
        Task<CommonEntityResponse> ResetPassword(SetNewPassword model, BctUser currentUser);
        Task<CommonEntityResponse> SendResendEmailOTP(string emailId);
        Task<CommonEntityResponse> VerifyEmailOTP(string otp, string email, int id);
        Task<CommonEntityResponse> SendResendMobileOTP(string mobileNumber, string countryCode);
        Task<CommonEntityResponse> VerifyMobileOTP(string otp, string mobileNumber, string countryCode, int userId);

    }
    public class BctUserService : IBctUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        readonly IMapper _mapper;
        IEncryptor _encryptor;
        IAuthService _authService;

        public BctUserService(IUnitOfWork unitOfWork, IMapper mapper, IEncryptor encryptor, IAuthService authService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _encryptor = encryptor;
            _authService = authService;
        }
        public async Task<BctUser> GetUserByUserName(string userName)
        {
            return await _unitOfWork.BctUsers.GetDataByUserName(userName);
        }
        public async Task<CommonEntityResponse> ModifyUserDetails(BctUserUserIdRequestModal model, BctUser CurrentUser)
        {
            BctLoginResponseModel response = new();
            int BctUserId = int.Parse(_encryptor.DecryptIDs(model.BctUserGUID));
            BctUser bctUser = await _unitOfWork.BctUsers.GetById(BctUserId);

            if (bctUser == null)
            {
                response.IsSuccess = false;
                response.CreateFailureResponse("User does not exist");
            }
            else
            {
                
                bctUser.FirstName = model.FirstName;
                bctUser.LastName = model.LastName;
                bctUser.UpdatedDate = DateTime.UtcNow;
                bool isUpdated = await _unitOfWork.BctUsers.CreateOrModify(bctUser);
                if (isUpdated)
                {
                    response.CreateSuccessResponse("User details updated successfully");
                }
                else
                {
                    response.CreateFailureResponse("failed to update user details");
                }
            }

            return response;
        }
        public async Task<ModelEntityResponse<BctUserViewModel>> GetBctUserDetails(int BctUserId)
        {
            ModelEntityResponse<BctUserViewModel> response = new ModelEntityResponse<BctUserViewModel>();
            BctUser BctUser = await _unitOfWork.BctUsers.GetById(BctUserId);
            if (BctUser != null)
            {
                response.Data = _mapper.Map<BctUserViewModel>(BctUser);
                //response.Data.BctUserGUID = _encryptor.EncryptIDs(response.Data.BctUserId.ToString());
                //response.Data.BctUserId = 0;
                if (response == null)
                {
                    response = new ModelEntityResponse<BctUserViewModel>();
                }
                response.CreateSuccessResponse();
            }
            else
            {
                response.CreateFailureResponse("User Details not found");
            }
            return response;
        }
        public async Task<CommonEntityResponse> ResetPassword(SetNewPassword model, BctUser currentUser)
        {

            CommonEntityResponse Response = new CommonEntityResponse();
            var currentPassword = _encryptor.EncryptByHash(model.CurrentPassword);
            model.CurrentPassword = currentPassword;
            int userId = 0;
            if (model.UserId <=0 )
            {
                userId = currentUser.BctUserId;
            }
            else
            {
                userId = model.UserId;
            }
            BctUser user = await _unitOfWork.BctUsers.GetUserByUserIdAndPassword(userId, currentPassword);
            
            if (user != null)
            {

                model.NewPassword = _encryptor.EncryptByHash(model.NewPassword);
                updatePasswordModel updatePasswordModel = new updatePasswordModel();
                updatePasswordModel.Password = model.NewPassword;
                updatePasswordModel.UserName = user.UserName;
                updatePasswordModel.Key = string.Empty;

                return await _unitOfWork.SessionResetPasswords.UpdatePassword(updatePasswordModel);

            }
            else
            {
                Response.IsSuccess = false;
                Response.CreateFailureResponse("Current password is incorrect");
            }
            return Response;
        }
        public async Task<CommonEntityResponse> SendResendEmailOTP(string emailId)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            bool isEmailSend = await _authService.SendResendEmailOTP(emailId);
            if (isEmailSend)
            {
                response.CreateSuccessResponse("OTP send to email");
                response.IsSuccess = true;
            }
            else
            {
                response.CreateFailureResponse("Failed to send OTP on email");
                response.IsSuccess = false;
            }
            return response;
        }
        public async Task<CommonEntityResponse> VerifyEmailOTP(string otp, string email, int id)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            
            BctUser bctUser = await _unitOfWork.BctUsers.GetById(id);
            
            bool verificationStatus = otp == "12345" ? true : false;// service to verify email OTP;
            if (verificationStatus)
            {
                bctUser.IsEmailVerified = true;

                if (bctUser.BctUserId != 0)
                {
                    bctUser.EmailId = email;
                    bctUser.IsEmailVerified = true;
                    if (!bctUser.IsVerified && bctUser.IsMobileNumberVerified)
                    {
                        bctUser.IsVerified = true;
                    }
                    _ = await _unitOfWork.BctUsers.CreateOrModify(bctUser);
                }
                response.CreateSuccessResponse("OTP Verification Successful");
                response.IsSuccess = true;
            }
            else
            {
                response.CreateFailureResponse("Failed to verify OTP");
                response.IsSuccess = false;
            }

            return response;
        }
        public async Task<CommonEntityResponse> SendResendMobileOTP(string mobileNumber, string countryCode)
        {
            CommonEntityResponse response = new CommonEntityResponse();

            int otp = 12345;// _mobileVerification.SendPhoneOTPByTwilio(model.CountryCodemobileNumber, countryCode);
            if (otp != 0)
            {
                response.IsSuccess = true;
                response.CreateSuccessResponse("OTP sent on mobile Number");
            }
            else
            {
                response.CreateFailureResponse("OTP not sent");
                response.IsSuccess = false;
            }
            return response;
        }

        public async Task<CommonEntityResponse> VerifyMobileOTP(string otp, string mobileNumber, string countryCode, int userId)
        {
            CommonEntityResponse response = new CommonEntityResponse();
           
            
            BctUser bctUser = await _unitOfWork.BctUsers.GetById(userId);
            
            bool verificationStatus = otp == "12345" ? true : false;
            if (verificationStatus)
            {
                if (bctUser.BctUserId != 0)
                {
                    //change mobile verification status
                    bctUser.MobileNumber = mobileNumber;
                    bctUser.CountryCode = countryCode;
                    bctUser.IsMobileNumberVerified = true;
                    if (bctUser.IsEmailVerified)
                    {
                        bctUser.IsVerified = true;
                    }
                    _ = await _unitOfWork.BctUsers.CreateOrModify(bctUser);
                }
                response.CreateSuccessResponse("OTP Verification Successful");
                
            }
            else
            {
                response.CreateFailureResponse("Failed to verify OTP");
            }
            return response;
        }

    }
}
