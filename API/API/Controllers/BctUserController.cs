using AutoMapper;
using API.Helpers;
using API.Services;
using Core.Models;
using Shared.Enums;
using ViewModels.Shared;
using ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System;
using ViewModels.Auth;
using Twilio.Exceptions;
using API.CustomAttributes;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ValidateUser("SupAdmin")]
    public class BctUserController : BaseController
    {
        private readonly IBctUserService _bctUserService;
        //private readonly IHttpContextAccessor _httpContextAccessor;
        IEncryptor _encryptor;
        public BctUserController(IBctUserService bctUserService, IHttpContextAccessor httpContextAccessor, IMapper mapper, ICommonService commonService, IEncryptor encryptor) : base(mapper, httpContextAccessor, commonService)
        {
            _bctUserService = bctUserService;
            //_httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            _encryptor = encryptor;
        }
        /// <summary>
        /// Updates the user profile for the BCT user.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Route("modify/details/self")]
        [HttpPost]
        [ProducesResponseType(typeof(ValidateBctUserModel), 200)]
        public async Task<CommonEntityResponse> ModifyBctUserAsync(BctUserUserIdRequestModal model)
        {
            var user = await getCurrentUser();
            CommonEntityResponse response = new();
            BctUserUserIdRequestModal vendor = new BctUserUserIdRequestModal();
            if (user == null)
            {
                response.IsSuccess = false;
                response.CreateFailureResponse("Invalid client request");
                return response;
            }
            else
            {
                try
                {

                    vendor.FirstName = model.FirstName;
                    vendor.LastName = model.LastName;
                    vendor.BctUserGUID = _encryptor.EncryptIDs(user.BctUserId.ToString());
                    response = await _bctUserService.ModifyUserDetails(vendor, user);

                }
                catch (Exception e)
                {
                    response.CreateFailureResponse(CommonData.ErrorMessage); ;

                    ExceptionLog log = new ExceptionLog();
                    log.Api = $@"api/BctUser/modify/details/self";
                    log.ApiType = ApiType.Post;
                    //log.Parameters = $@"";
                    log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                    log.Message = e.Message;
                    log.StackTrace = e.StackTrace;
                    await SaveExceptionLog(log);
                }
            }
            return response;
        }
        /// <summary>
        ///  Retrieves the logged-in user details for the BCT user.
        /// </summary>
        /// <returns></returns>
        [Route("Get/Details/self")]
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(BctUserViewModel), 200)]
        public async Task<ModelEntityResponse<BctUserViewModel>> GetBctUserDetails()
        {
            ModelEntityResponse<BctUserViewModel> response = new ModelEntityResponse<BctUserViewModel>();
            try
            {
                int userId = await getCurrentUserID();
                response = await _bctUserService.GetBctUserDetails(userId);

            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage); ;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/BctUser/Get/Details";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"";
                //log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
        /// <summary>
        /// Resets the password for the BCT user.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Route("resetPassword")]
        [HttpPost]
        [ProducesResponseType(typeof(SetNewPassword), 200)]
        public async Task<CommonEntityResponse> SetNewPasswordAsync(SetNewPassword model)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            
            var currentUser = await getCurrentUser();
            try
            {
                response = await _bctUserService.ResetPassword(model, currentUser);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage); ;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/BctUser/resetPassword";
                log.ApiType = ApiType.Post;
                //log.Parameters = $@"";
                log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
        /// <summary>
        ///Sends or resends an OTP via email.
        /// </summary>
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Route("sendResendEmailOTP")]
        [HttpGet]
        public async Task<CommonEntityResponse> SendResendEmailOTPAsync(string email)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                response = await _bctUserService.SendResendEmailOTP(email);
            }
            catch (TwilioException e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage); ;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/BctUser/sendResendEmailOTP";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"email={email}";
                //log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
        /// <summary>
        /// Verifies the email OTP.
        /// Api path will be api/VendorUser/sendResendEmailOTP
        /// </summary>
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Route("verify/emailOTP")]
        [HttpGet]
        public async Task<CommonEntityResponse> VerifyEmailOTPAsync(string otp, string email)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                int id = await getCurrentUserID();
                response = await _bctUserService.VerifyEmailOTP(otp, email, id);
            }
            catch (TwilioException e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage); ;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/BctUser/verify/emailOTP";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"otp={otp}, email={email}";
                //log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        /// <summary>
        /// Sends or resends an OTP via mobile. 
        /// </summary>
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Route("sendResendMobileOTP")]
        [HttpGet]
        public async Task<CommonEntityResponse> SendResendOTPAsync(string mobileNumber, string countryCode)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                response = await _bctUserService.SendResendMobileOTP(mobileNumber, countryCode);
            }
            catch (TwilioException e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage); ;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/BctUser/sendResendMobileOTP";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"mobileNumber={mobileNumber},countryCode={countryCode}";
                //log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        /// <summary>
        ///Verifies the mobile OTP
        /// </summary>
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Route("verify/mobileOTP")]
        [HttpGet]
        public async Task<CommonEntityResponse> VerifyMobileOTPAsync(string otp, string mobileNumber, string countryCode, string type)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                 int id = await getCurrentUserID();
                 response = await _bctUserService.VerifyMobileOTP(otp, mobileNumber, countryCode, id);
            }
            catch (TwilioException e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage); ;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/BctUser/verify/mobileOTP";
                log.ApiType = ApiType.Get;
                log.Parameters = $@"otp={otp}, mobileNumber={mobileNumber}, countryCode={countryCode}, type={type}";
                //log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
    }
}
