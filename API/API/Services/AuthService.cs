using AutoMapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Reflection;
using System.Threading.Tasks;
using API.Helpers;
using Core.Models;
using Repository;
using Shared.Enums;
using ViewModels;
using ViewModels.Admin;
using ViewModels.Auth;
using ViewModels.Shared;
using ViewModels.User;
using Twilio.Http;
using Twilio.TwiML.Messaging;
using Twilio.TwiML.Voice;
using static API.Helpers.ConfigureJWTAuthentication;

namespace API.Services
{
    public interface IAuthService
    {
        Task<BctLoginResponseModel> Login(AccountLoginModel model);
        Task<BctLoginResponseModel> LoginProcess(BctUser user);
        Task<CommonEntityResponse> ForgotPassword(ForgotPasswordModel model, BctUser user);
        Task<CommonEntityResponse> ResetPassword(updatePasswordModel model);
        Task<CommonEntityResponse> forgotUserName(forgotUserNameModel model);
        Task<bool> SendResendEmailOTP(string emailId);
        Task<int> SendResendMobileOTP(string countryCode, string mobileNumber);
        Task<bool> CreateDefaultUser();
        Task<bool> CreateBctUser(BctUserRegistrationModel model);
    }
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        readonly IMapper _mapper;
        IEncryptor _encryptor;
        IEmailSender _emailSender;
        IConfiguration _configuration;
        IMobileVerification _mobileVerification;
        public AuthService(IUnitOfWork unitOfWork, IMapper mapper, IEncryptor encryptor, IEmailSender emailSender, IConfiguration configuration, IMobileVerification mobileVerification)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _encryptor = encryptor;
            _emailSender = emailSender;
            _configuration = configuration;    
        }
        
        public async Task<BctLoginResponseModel> LoginProcess(BctUser user)
        {
            BctLoginResponseModel response = new();

            // valid password received; generate auth tokens
            var userGUID = _encryptor.EncryptIDs(user.BctUserId.ToString());

            var accessTokenData = GenerateBctUserAccessToken(user, userGUID, true);
            var refreshTokenData = GenerateRefreshToken();

            if (accessTokenData is null || refreshTokenData is null)
            {
                response.IsSuccess = false;
                response.CreateFailureResponse("Authentication failed. Please try later.");
                return response;
            }

            BctUserCredential credential = await _unitOfWork.BctUserCredentials.GetByUserId(user.BctUserId);
            //response.IsSuperAdminCreated = IsSuperAdminCreated;
            credential.RefreshToken = refreshTokenData.RefreshToken;
            credential.RefreshTokenExpiryTime = refreshTokenData.ExpiryTime;
            credential.UpdatedDate = DateTime.UtcNow;
            _ = await _unitOfWork.BctUserCredentials.CreateOrModify(credential);

            // return response
            response.Data = new()
            {
                AccessToken = accessTokenData.AccessToken,
                ExpiresIn = accessTokenData.ExpiresIn,
                RefreshToken = refreshTokenData.RefreshToken,
            };
            response.IsSuccess = true;
            //response.EntityId = user.VendorUserId;
            response.CreateSuccessResponse();

            return response;
        }

        public async Task<BctLoginResponseModel> Login(AccountLoginModel model)
        {
            try
            {
                BctLoginResponseModel response = new BctLoginResponseModel();
                var password = _encryptor.EncryptByHash(model.Password);
                model.Password = password;

                BctUser user = await _unitOfWork.BctUsers.GetUserByUsernameAndPasswordId(model);
                if (user != null)
                {
                    if (user.IsEmailVerified && user.IsMobileNumberVerified)
                    {
                        response = await LoginProcess(user);
                        response.IsVerified = true;
                    }
                    else if (!user.IsMobileNumberVerified)
                    {
                        response.IsVerified = false;
                        //send otp to mobile number
                        int otp = await SendResendMobileOTP(user.CountryCode, user.MobileNumber);
                        if (otp != 0)
                        {
                            //response.EntityId = user.VendorUserId;
                            response.IsSuccess = true;
                            response.CreateSuccessResponse("Otp send to mobile number");
                        }
                        else
                        {
                            //response.EntityId = user.VendorUserId;
                            response.IsSuccess = false;
                            response.CreateFailureResponse("Failed to send mobile otp");
                        }
                        return response;
                    }
                    else
                    {
                        //send otp to email
                        response.IsVerified = false;
                        bool isOtpSend = await SendResendEmailOTP(user.EmailId);
                        if (isOtpSend)
                        {
                            //response.EntityId = user.VendorUserId;
                            response.IsSuccess = true;
                            response.CreateSuccessResponse("Otp send to email");
                        }
                        else
                        {
                            //response.EntityId = user.VendorUserId;
                            response.IsSuccess = false;
                            response.CreateFailureResponse("Failed to send email otp");
                        }
                        return response;
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.CreateFailureResponse("User Name or password invalid");
                    return response;
                }
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.StackTrace);
            }

        }

        public async Task<CommonEntityResponse> ForgotPassword(ForgotPasswordModel model, BctUser user)
        {
            CommonEntityResponse responce = new CommonEntityResponse();
            string key = Guid.NewGuid().ToString();
            SessionResetPassword obj = new SessionResetPassword();
            obj.Key = key;
            obj.UserName = model.username;
            await _unitOfWork.SessionResetPasswords.Create(obj);
            string domain = _configuration["CommonSettings:webUrl"];

            string token = GenerateResetPasswordToken(model.username, key).AccessToken;

            string URL = $@"{domain}/resetPassword/{token}";

            string emailcontent = @"<!DOCTYPE html>
                            <html><head>Reset Password(Digi Recipies system) :</head><body>";
            emailcontent += "reset Password link";
            emailcontent += "  " + URL;
            emailcontent += @"</p></p> </body> </html>";

            bool emailResponse = await _emailSender.SendEmailSMTPAsync(user.EmailId, "Reset Password ", "", emailcontent);

            if (emailResponse)
            {
                responce.IsSuccess = true;
                string email = await _emailSender.maskEmail(user.EmailId);
                responce.CreateSuccessResponse($@"Reset Password url sent to {email}");
            }

            else
            {
                //revert user if created
                //await _unitOfWork.Users.DeleteById(user.UserId);
                responce.IsSuccess = false;
                responce.CreateFailureResponse("Reset Password failed");

            }

            return responce;
        }

        public async Task<CommonEntityResponse> ResetPassword(updatePasswordModel model)
        {

            CommonEntityResponse Response = new CommonEntityResponse();
            bool isValidKey = await _unitOfWork.SessionResetPasswords.IsValidKey(model);
            model.Password = _encryptor.EncryptByHash(model.Password);
            if (isValidKey)
            {
                return await _unitOfWork.SessionResetPasswords.UpdatePassword(model);
            }
            else
            {
                Response.IsSuccess = false;
                Response.CreateFailureResponse("Invalid key or timed out.");
            }
            return Response;
        }

        public async Task<CommonEntityResponse> forgotUserName(forgotUserNameModel model)
        {
            CommonEntityResponse responce = new CommonEntityResponse();

            BctUser user = await _unitOfWork.BctUsers.GetUsersByEmailId(model.emailId);
            if (user == null)
            {
                responce.IsSuccess = false;
                responce.CreateFailureResponse("Email id does not exist");
                return responce;
            }
            if (user.Status == Status.Suspend)
            {
                responce.IsSuccess = false;
                responce.CreateFailureResponse("user is in inactive state");
                return responce;
            }
            //if (user.Status == (int)Status.Delete)
            //{
            //    responce.IsSuccess = false;
            //    responce.CreateFailureResponse("user is in inactive state");
            //    return responce;
            //}
            string emailcontent = @"<!DOCTYPE html>
                            <html><head>Forgot User Name(Digi Recipies system) :</head><body>";
            emailcontent += "User Name : ";
            emailcontent += "  " + user.UserName;
            emailcontent += @"</p></p> </body> </html>";

            bool emailResponse = await _emailSender.SendEmailSMTPAsync(user.EmailId, "Forgot User Name ", "", emailcontent);

            if (emailResponse)
            {
                responce.IsSuccess = true;
                string email = await _emailSender.maskEmail(user.EmailId);
                responce.CreateSuccessResponse($@"Username sent to {email}");
            }

            else
            {
                responce.IsSuccess = false;
                responce.CreateFailureResponse("failed");
            }

            return responce;
        }
        public async Task<bool> SendResendEmailOTP(string emailId)
        {
            string emailOtp = "12345";
            string emailcontent = @"<!DOCTYPE html>
                                        <html><head>DIGI Receipt";
            emailcontent += @"</head><body>";
            emailcontent += @"<p>Hi,</br> Please enter the following code to verify your email </br><b> ";
            emailcontent += emailOtp;
            emailcontent += @"</b></p> </body> </html>";
            return await _emailSender.SendEmailSMTPAsync(emailId, "DIGI Receipt Verification Code", null, emailcontent);
        }
        public async Task<int> SendResendMobileOTP(string countryCode, string mobileNumber)
        {
            int otp = 12345; //_mobileVerification.SendPhoneOTPByTwilio(countryCode, mobileNumber);
            return otp;
        }
        public async Task<bool> CreateDefaultUser()
        {
            return true;
            using (var transaction = _unitOfWork._context.Database.BeginTransaction())
            {
                var isExist = await _unitOfWork.BctUsers.IsRegexUserExist();
                if (isExist)
                {
                    return false;
                }
                try
                {
                    var password = _encryptor.EncryptByHash("12345678");
                    BctUser user = new BctUser();
                    user.FirstName = "bct";
                    user.LastName = "user";
                    user.EmailId = "bct@borncode.in";
                    user.MobileNumber = "9999999999";
                    user.CountryCode = "+91";
                    user.UserName = "bct user";
                    user.Status=Status.Active;
                    user.IsMobileNumberVerified = true;
                    user.IsEmailVerified = true;
                    user.IsVerified = true;
                    user.UserType = BCTUserType.BctUser;

                    int bctUserId = await _unitOfWork.BctUsers.SaveAndGetId(user);

                    BctUserCredential crd = new BctUserCredential();
                    crd.BctUserId = bctUserId;
                    crd.Password = password;

                    await _unitOfWork.BctUserCredentials.CreateAndGetId(crd);
                    transaction.Commit();
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");

                    transaction.Rollback();
                    return false;
                }
            }
            
        }
        public async Task<bool> CreateBctUser(BctUserRegistrationModel model)
        {
            using (var transaction = _unitOfWork._context.Database.BeginTransaction())
            {
                try
                {
                    var password = _encryptor.EncryptByHash(model.Password);
                    BctUser user = new BctUser();
                    user = _mapper.Map<BctUser>(model);

                    int bctUserId = await _unitOfWork.BctUsers.SaveAndGetId(user);

                    BctUserCredential crd = new BctUserCredential();
                    crd.BctUserId = bctUserId;
                    crd.Password = password;

                    await _unitOfWork.BctUserCredentials.CreateAndGetId(crd);
                    transaction.Commit();
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");

                    transaction.Rollback();
                    return false;
                }
            }

        }
    }
}
