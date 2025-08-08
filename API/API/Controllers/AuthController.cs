using ViewModels.User;
using ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using API.Services;
using Core.Models;
using ViewModels.Auth;
using ViewModels.Shared;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Shared.Enums;
using Newtonsoft.Json;
using AutoMapper;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly IAuthService _authService;
        private readonly IBctUserService _bctUserService;

        public AuthController(IAuthService accountService,IBctUserService bctUserService, IMapper mapper, IHttpContextAccessor httpContextAccessor, ICommonService commonService) : base(mapper, httpContextAccessor, commonService)
        {
            _authService = accountService;
            _bctUserService = bctUserService;
        }

        /// <summary>
        /// Logs in a BCT user with username and password.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("Login")]
        [HttpPost]
        [ProducesResponseType(typeof(BctLoginResponseModel), 200)]
        public async Task<BctLoginResponseModel> LoginAsync([FromBody] AccountLoginModel model)
        {
            //string Code = model.Otp;
            BctLoginResponseModel response = new();

            try
            {
                return await _authService.Login(model);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Auth/Login";
                log.ApiType = ApiType.Post;
                log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }

        /// <summary>
        ///  Verifies the username and sends a password reset link via email.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("forgot/password")]
        // [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        public async Task<CommonEntityResponse> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            CommonEntityResponse response = new();

            try
            {
                BctUser user = await _bctUserService.GetUserByUserName(model.username);
                if (user == null)
                {
                    response.IsSuccess = false;
                    response.CreateFailureResponse("invalid username");
                    return response;

                }
                if (user.Status == Status.Active)
                {
                    response = await _authService.ForgotPassword(model, user);
                }
                else
                {
                    response.IsSuccess = false;
                    response.CreateFailureResponse("invalid username"); // inactive user
                }
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Auth/forgot/password";
                log.ApiType = ApiType.Post;
                log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
        /// <summary>
        /// Resets the password. Verifies the key that is generated when the forgotPassword API is called.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("resetPassword")]
        // [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        public async Task<CommonEntityResponse> resetPassword([FromBody] ResetPasswordModel model)
        {
            CommonEntityResponse response = new();
            try
            {
                updatePasswordModel updateModel = new updatePasswordModel();
                //model.Key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InJvb3Blc2giLCJrZXkiOiI2Y2MxMDBjMi1hM2E4LTQ5Y2MtODBkNi0wZDVmNDFiN2NhMWYiLCJpc3MiOiJEaWdpUmVjZWlwdElzc3VlciJ9.-ywnFgTRz-oH1U13sU8EIZkUCHeqS8z6PJNQqwb0HOs";
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(model.Key);
                var tokenS = jsonToken as JwtSecurityToken;
                updateModel.UserName = tokenS.Claims.First(claim => claim.Type == "userName").Value;
                updateModel.Key = tokenS.Claims.First(claim => claim.Type == "key").Value;
                updateModel.Password = model.Password;
                response = await _authService.ResetPassword(updateModel);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Auth/resetPassword";
                log.ApiType = ApiType.Post;
                log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
        /// <summary>
        /// Verifies the email and sends the username to the provided email address.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("forgotUserName")]
        // [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost]
        [ProducesResponseType(typeof(CommonEntityResponse), 200)]
        public async Task<CommonEntityResponse> forgotUserName([FromBody] forgotUserNameModel model)
        {
            CommonEntityResponse response = new();
            try
            {
                response = await _authService.forgotUserName(model);
            }
            catch (Exception e)
            {
                response.CreateFailureResponse(CommonData.ErrorMessage);;

                ExceptionLog log = new ExceptionLog();
                log.Api = $@"api/Auth/forgotUserName";
                log.ApiType = ApiType.Post;
                log.Parameters = JsonConvert.SerializeObject(model, Formatting.Indented);
                log.Message = e.Message;
                log.StackTrace = e.StackTrace;
                await SaveExceptionLog(log);
            }
            return response;
        }
    }

}
