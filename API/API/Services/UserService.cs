using AutoMapper;
using System.Threading.Tasks;
using API.Helpers;
using Core.Models;
using ViewModels;
using ViewModels.Shared;
using ViewModels.User;
using System;
using static API.Helpers.ConfigureJWTAuthentication;
using Twilio.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    //public interface IUserService
    //{
    //    Task<CommonEntityResponse> RegisterUser(UserRequestModel model);
    //    Task<LoginResponseModel> LoginUser(LoginRequestModel model);
    //    Task<LoginResponseModel> LoginUserByMobile(OptVerificationModel model);
    //    Task<CommonEntityResponse> ModifyUserOTP(UserModifyOTPRequestModel model);
    //    Task<bool> RevertTransaction(string emailId);
    //    Task<CommonEntityResponse> MobileEmailVerifcation(ResetPaswordRequestModel model);
    //    Task<EndPointUserResponseModel> EndPointUser(int userId);
    //    Task<CommonEntityResponse> RemoveById(int userId);
    //    Task<CommonEntityResponse> VerifyOTP(OptVerificationModel model);
    //    Task<CommonEntityResponse> ResetPassword(ResetPaswordRequestModel model);
    //    Task<SendOTPResposeModel> SendResendOTP(MobileNumbemodel model);
    //    Task<CommonEntityResponse> ResetPasswordInAccount(ResetPaswordInAccountRequestModel model);
    //    Task<QRScanResposeModel> GetQrScanPath(int userId);
    //    Task<Users> GetUserByIdAsync(int userId);
    //    Task<Users> UpdateUserAsync(Users user);
    //    Task<SendOTPResposeModel> UserModifySendOTPAsync(ModifyUserRequestModel model);
    //    Task<LoginResultModel> VerifyUserByMobile(LoginRequestModel model);
    //    Task<LoginResponseModel> VerifyNewUserRegistration(OptVerificationModel model);
    //    Task<CommonEntityResponse> UpdateProfileImage(UpdateProfileImageRequestModel model);
    //    Task<ValidateUserResponseModel> ValidateUser(string CountryCode, string MobileNumber, string EmailId);

    //    Task<CountryResultModel> GetUserCountryDetails(int userId);
    //}
    //public class UserService : IUserService
    //{
    //    readonly IMapper _mapper;
    //    private readonly IUnitOfWork _unitOfWork;
    //    IEmailSender _emailSender;
    //    IEncryptor _encryptor;
    //    IMiscellaneousFunctions _miscellaneousFunctions;
    //    IQRScan _qRScan;
    //    IBarCodes _barcode;
    //    IMobileVerification _mobileVerification;
    //    IMedia _media;
    //    readonly IWebHostEnvironment _env;
    //    readonly IConfiguration _config;
    //    public UserService(IUnitOfWork unitOfWork, IMapper mapper, IEmailSender emailSender, IMiscellaneousFunctions miscellaneousFunctions, IQRScan qRScan, IEncryptor encryptor, IMobileVerification mobileVerification, IBarCodes barcode, IMedia media, IWebHostEnvironment env, IConfiguration config)
    //    {
    //        _unitOfWork = unitOfWork;
    //        _mapper = mapper;
    //        _emailSender = emailSender;
    //        _miscellaneousFunctions = miscellaneousFunctions;
    //        _qRScan = qRScan;
    //        _encryptor = encryptor;
    //        _mobileVerification = mobileVerification;
    //        _barcode = barcode;
    //        _media = media;
    //        _env = env;
    //        _config = config;
    //    }

    //    /// <summary>
    //    /// This method to revert userdata from db and delete QRfile,if registration exception error
    //    /// </summary>
    //    /// <param name="emailId"></param>
    //    /// <returns></returns>
    //    public async Task<bool> RevertTransaction(string emailId)
    //    {
    //        Users user = await _unitOfWork.Users.GetDataByEmailId(emailId);
    //        if (user.UserId > 0)
    //        {
    //            _qRScan.RemoveQRCode(user.QRCode);//delete qrfile if exist
    //            _barcode.RemoveBarCode(user.BarCode);//delete barcode file if exist
    //            await _unitOfWork.Users.DeleteById(user.UserId); //delete datatable record if exist
    //        }
    //        return true;
    //    }


    //    public async Task<ValidateUserResponseModel> ValidateUser(string CountryCode, string MobileNumber, string EmailId)
    //    {
    //        ValidateUserResponseModel response = new();
    //        // to check is mobile exist in database already
    //       Users user = await _unitOfWork.Users.GetDataByMobileNumber(CountryCode, MobileNumber);
    //        if (user is not null)
    //        { 
    //            //exist
    //            if (user.IsActivate)
    //            {
    //                response.CreateFailureResponse("Mobile is already registered .");
    //                response.IsSuccess = false;                  
    //                return response;
    //            }
    //            else
    //            {
                    
    //               await _unitOfWork.Users.DeleteById(user.UserId);
    //                response.CreateSuccessResponse("New registration");
    //                response.IsSuccess = true;                 
    //                return response;
    //            }

    //        }
    //        else
    //        {

    //            //check email exist or not
    //            //get user
    //            var emailuser = await _unitOfWork.Users.GetUserByEmailId(EmailId);    
    //            if (emailuser is not null)
    //            {
    //                //email is  exist
    //                //get user
    //                int emailUserCount = await _unitOfWork.Users.GetActiveUserByEmailIdCount(EmailId);

    //                if (emailUserCount > 0)
    //                {
    //                    response.IsSuccess = true;
    //                    response.CreateSuccessResponse("Other accounts are linked with this ..Do you want to continue?");
    //                    response.MessageFlag = true;
    //                    return response;
    //                }
    //                else
    //                {
    //                    response.CreateSuccessResponse("New Mobile Number...new account creation. ");
    //                    response.IsSuccess = true;
    //                    return response;
    //                }
    //            }
    //            else
    //            {
    //                // exist ...so new registration
    //                response.CreateSuccessResponse("New Registration.");
    //                response.IsSuccess = true;
    //                return response;
    //            }
  
    //        }

    //    }

    //    /// <summary>
    //    /// get endpoint user after successful login
    //    /// </summary>
    //    /// <param name="userId"></param>
    //    /// <returns></returns>
    //    public async Task<EndPointUserResponseModel> EndPointUser(int userId)
    //    {
    //        EndPointUserResponseModel response = new EndPointUserResponseModel();
    //        Users user = await _unitOfWork.Users.GetById(userId);
    //        if (user != null)
    //        {
    //            user.QRCode = _config.GetValue<string>("Paths:ImagePath")+user.QRCode;
    //            user.BarCode = _config.GetValue<string>("Paths:ImagePath") + user.BarCode;
    //            user.ProfileImage = _config.GetValue<string>("Paths:ImagePath") + user.ProfileImage;
    //            response.Data = _mapper.Map<EndPointUserInfo>(user);
    //            if (response == null)
    //            {
    //                //for unit testing
    //                response = new();
    //                response.Data = new EndPointUserInfo();
    //            }
    //            else
    //            {
    //                response.Data.UserGUID = _encryptor.EncryptIDs(response.Data.UserId.ToString());
    //            }
    //            response.IsSuccess = true;
    //            //response.EntityId = userId;
    //            response.CreateSuccessResponse();
    //        }
    //        else
    //        {
    //            response.CreateFailureResponse("EndPoint User not found");
    //            response.IsSuccess = false;
    //           // response.EntityId = userId;
    //        }
    //        return response;
    //    }

    //    /// <summary>
    //    /// get user by id
    //    /// </summary>
    //    /// <param name="userId"></param>
    //    /// <returns></returns>
    //    public async Task<Users> GetUserByIdAsync(int userId)
    //    {
    //        return await _unitOfWork.Users.GetById(userId);
    //    }

    //    /// <summary>
    //    /// get user by id
    //    /// </summary>
    //    /// <param name="userId"></param>
    //    /// <returns></returns>
    //    public async Task<Users> UpdateUserAsync(Users user)
    //    {
    //        return await _unitOfWork.Users.UpdateUserAsync(user);
    //    }



    //    public async Task<LoginResponseModel> Loginprocess(Users user)
    //    {
    //        LoginResponseModel response = new();
    //        // valid password received; generate auth tokens
    //        var accessTokenData = GenerateAccessToken(user, true);
    //        var refreshTokenData = GenerateRefreshToken();

    //        if (accessTokenData is null || refreshTokenData is null)
    //        {
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("Authentication failed. Please try later.");
    //            return response;
    //        }

    //        //check for first login
    //        //check invoice present in temp user invoice table.
    //        if(user.CreatedDate == user.UpdatedDate)
    //        {
    //            //firstlogin found
    //            response.isFirstLogin = true;
    //            bool isTransactionFound = await _unitOfWork.TempUserTransactions.IsTransactionFound(user.MobileNumber);
    //            if (isTransactionFound)
    //            {
    //                response.isDigiInvoiceFound = true;
    //            }
    //        }
    //        // update refresh token details
    //        user.RefreshToken = refreshTokenData.RefreshToken;
    //        user.RefreshTokenExpiryTime = refreshTokenData.ExpiryTime;
    //        user.UpdatedDate = DateTime.UtcNow;
    //        _ = await _unitOfWork.Users.UpdateUserAsync(user);

    //        // return response
    //        response.Data = new()
    //        {
    //            AccessToken = accessTokenData.AccessToken,
    //            ExpiresIn = accessTokenData.ExpiresIn,
    //            RefreshToken = refreshTokenData.RefreshToken
    //        };
    //        response.UserTypeCode = user.UserTypeCode;
    //        response.IsSuccess = true;
    //        response.EntityId = user.UserId;
    //        response.CreateSuccessResponse();
    //        return response;
    //    }
    //    /// <summary>
    //    /// This method is used to Login user
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<LoginResponseModel> LoginUser(LoginRequestModel model)
    //    {
    //        LoginResponseModel response = new();

    //        //get user
    //        var user = await _unitOfWork.Users.GetUserByEmailId(model.EmailId);

    //        // user does not exist; return
    //        if (user is null)
    //        {
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("Email Id is not registered with us.");
    //            return response;
    //        }


    //        // user exists; validate the received password
    //        string encryptedReceivedPassword = _encryptor.EncryptByHash(model.Password);
    //        bool isEqualPassword = _encryptor.IsEqualPassword(encryptedReceivedPassword, user.Password);

    //        // invalid password received; return
    //        if (!isEqualPassword)
    //        {
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("Incorrect Password.");
    //            return response;
    //        }

    //        return await Loginprocess(user);

    //    }

    //    /// <summary>
    //    /// This method is used to Login user
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<LoginResponseModel> LoginUserByMobile(OptVerificationModel model)
    //    {
    //        LoginResponseModel response = new();
    //        model.IsOtpLogin = true;
    //         ////get user
    //        var user = await _unitOfWork.Users.GetUserByMobilAndCountryCode(model.CountryCode + " "+model.MobileNumber);

    //        // user does not exist; return
    //        if (user is null)
    //        {
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("Mobile number is not registered with us.");
    //            return response;
    //        }
    //        else if( !user.IsActivate)
    //        {
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("Verify OTP to activate account");
    //            return response;
    //        }
    //        else
    //        {
    //            CommonEntityResponse entityResponse = new CommonEntityResponse(); //await VerifyOTP(model);
    //            //for test purpose
    //            if(model.IsOtpLogin)
    //            {
    //                if (model.Otp == "12345")
    //                {
    //                    entityResponse.IsSuccess = true;
    //                }
    //                else
    //                {
    //                    entityResponse.IsSuccess = false;
    //                    response.CreateFailureResponse("Invalid OTP");
    //                    return response;
    //                }
    //            }
    //            else
    //            {
    //                model.Password = _encryptor.EncryptByHash(model.Password);
    //                if(model.Password.Equals(user.Password))
    //                {
    //                    entityResponse.IsSuccess = true;
    //                }
    //                else
    //                {
    //                    entityResponse.IsSuccess = false;
    //                    response.CreateFailureResponse("Invalid Password");
    //                    return response;
    //                }
    //            }
               

    //            if (entityResponse.IsSuccess)
    //            {
                    
    //                return await Loginprocess(user);
    //            }
    //            else
    //            {
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("Something went wrong!.");
    //                return response;
    //            }
    //        }
    //        //// user exists; validate the received password
    //        //string encryptedReceivedPassword = _encryptor.Encrypt(model.Password);
    //        //bool isEqualPassword = _encryptor.IsEqualPassword(encryptedReceivedPassword, user.Password);

    //        //// invalid password received; return
    //        //if (!isEqualPassword)
    //        //{
    //        //    response.IsSuccess = false;
    //        //    response.CreateFailureResponse("Incorrect Password.");
    //        //    return response;
    //        //}

           

    //    }

    //    /// <summary>
    //    /// This method is used to verify the mobile number and call OTP service
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<LoginResultModel> VerifyUserByMobile(LoginRequestModel model)
    //    {
    //        LoginResultModel response = new();

    //        //get user
    //        var user = await _unitOfWork.Users.GetUserByMobilAndCountryCode(model.CountryCode+" "+model.MobileNumber);

    //        // user does not exist; return
    //        if (user is null)
    //        {
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("Mobile number is not registered with us.");
    //            return response;
    //        }

    //        ////Send resend OTP
    //        ////call the section only for first time identification.If face Id or bio metric enbled not needed
    //        //MobileNumbemodel mob = new MobileNumbemodel();
    //        //mob.MobileNumber = user.MobileNumber;
    //        //mob.CountryCode = user.CountryCode;

    //        //SendOTPResposeModel otpResponse = await SendResendOTP(mob);
    //        //if (otpResponse.IsSuccess)
    //        //{
    //        //    response.IsSuccess = true;
    //        //    response.CreateSuccessResponse("OTP sent on mobile Number");
    //        //    response.OTP = otpResponse.OTP;
    //        //}
    //        //else
    //        //{
    //        //    response.CreateFailureResponse("OTP not sent");
    //        //    response.IsSuccess = false;
    //        //}

    //        //For testing purpose
    //        response.UserTypeId = user.UserTypeCode;
    //        response.IsSuccess = true;
    //        response.CreateSuccessResponse("OTP sent on mobile Number");
    //        //send OTP to email


    //        return response;
    //    }

    //    /// <summary>
    //    /// This method is used to modify existing method without password modification
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<CommonEntityResponse> ModifyUserOTP(UserModifyOTPRequestModel model)
    //    {
    //        CommonEntityResponse response = new CommonEntityResponse();
    //        if (model.OtpType == 1)
    //        {
    //            //verify Mobile Otp
    //            if (model.MobileOTP != "12345")
    //            {
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("Invalid Mobile Otp ");
    //                return response;
    //            }

    //        }
    //        if (model.OtpType == 2)
    //        {
    //            //veryfy Email Otp
    //            if (model.EmailOTP != "12345")
    //            {
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("Invalid Email Otp ");
    //                return response;
    //            }

    //        }
    //        if (model.OtpType == 3)
    //        {
    //            //verify Bot Otps
    //            if (model.MobileOTP != "12345")
    //            {
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("Invalid Mobile Otp ");
    //                return response;
    //            }
    //            if (model.EmailOTP != "12345")
    //            {
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("Invalid Email Otp ");
    //                return response;
    //            }
    //        }



    //        Users user = await _unitOfWork.Users.GetById(model.UserId);
    //        if (user != null)
    //        {
    //            //string usermobileNumberwithCode = user.CountryCode + user.MobileNumber;
    //            //string modelmobileNumberwithCode = model.CountryCode + model.MobileNumber;
    //            string scannerData = "";
    //            if (model.OtpType == 1)
    //            {

    //                scannerData = "UserId=" + user.UserId + ", Mobile=" + model.CountryCode + " " + model.MobileNumber + ", Email=" + user.EmailId;

    //            }
    //            if (model.OtpType == 2)
    //            {
    //                scannerData = "UserId=" + user.UserId + ", Mobile=" + user.CountryCode + " " + user.MobileNumber + ", Email=" + model.EmailId;

    //            }
    //            if (model.OtpType == 3)
    //            {
    //                scannerData = "UserId=" + user.UserId + ", Mobile=" + model.CountryCode + " " + model.MobileNumber + ", Email=" + model.EmailId;
    //            }

    //            //delete existing code
    //            _qRScan.RemoveQRCode("/QRScans/QR_" + user.UserId + ".png");

    //            //create new QrScan code

    //            string qrFileName = await _qRScan.CreateQRCode(scannerData, "QR_" + user.UserId);
    //            user.QRCode = "/QRScans/" + qrFileName;



    //            //delete existing  Bar code
    //            _barcode.RemoveBarCode("/BarCodes/BR_" + user.UserId + ".png");
    //            //create new Barcode 
    //            string barFileName = await _barcode.CreateBarCode(scannerData, "BR_" + user.UserId); //qrFileName; //await _barcode.CreateBarCode(model.UserId + " " + model.CountryCode + model.MobileNumber + " " + model.EmailId, "Bar_" + model.UserId);
    //            user.BarCode = "/BarCodes/" + barFileName;


    //            //mapping to update data


    //            if (model.OtpType == 1)
    //            {
    //                //upate only mobile
    //                user.CountryCode = model.CountryCode;
    //                user.MobileNumber = model.MobileNumber;
    //            }
    //            if (model.OtpType == 2)
    //            {
    //                //update only email
    //                user.EmailId = model.EmailId;

    //            }
    //            if (model.OtpType == 3)
    //            {
    //                //update email and mobile
    //                user.EmailId = model.EmailId;
    //                user.CountryCode = model.CountryCode;
    //                user.MobileNumber = model.MobileNumber;
    //            }

    //            user.UpdatedDate = DateTime.UtcNow;

    //            bool modifystatus = await _unitOfWork.Users.ModifyById(user);
    //            if (modifystatus)
    //            {
    //                response.EntityId = user.UserId;
    //                response.IsSuccess = true;
    //                response.CreateSuccessResponse("User Updated Successfully");
    //                return response;
    //            }
    //        }
    //        else
    //        {

    //            //fail
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("User not Updated ");
    //            return response;
    //        }
    //        return response;
    //    }

    //    /// <summary>
    //    /// This method is used to Register new user
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<CommonEntityResponse> RegisterUser(UserRequestModel model)
    //    {
    //        CommonEntityResponse response = new CommonEntityResponse();
           

    //            //New registration entry


    //            //encrypt the password
    //            string password = model.Password;
    //            model.Password = _encryptor.EncryptByHash(model.Password);
    //            // password hashing
    //            //  string password = model.Password;
    //            //  string hashedpassword = "";
    //            //  PasswordHasher<string> passwordHasher = new PasswordHasher<string>();
    //            //model.Password = passwordHasher.HashPassword(hashedpassword, model.Password);

    //            //mapping data in db
    //            // Users user = _mapper.Map<UserRequestModel, Users>(model);
    //            //manual mapping  for unit testing
    //            Users user = new Users()
    //            {

    //                UserId = string.IsNullOrWhiteSpace(model.UserGUID)?0: Convert.ToInt32( _encryptor.DecryptIDs(model.UserGUID)),
    //                CountryCode = model.CountryCode,
    //                QRCode = model.QRCode,
    //                Title = model.Title,
    //                FirstName = model.FirstName,
    //                LastName = model.LastName,
    //                EmailId = model.EmailId,
    //                Password = model.Password,
    //                MobileNumber = model.MobileNumber,
    //                Default = model.Default,
    //                UserTypeCode = model.UserTypeCode,
    //                BarCode = model.QRCode,
    //                IsActivate = false
    //            };
    //            //Add it to get userId
    //            bool status = await _unitOfWork.Users.CreateOrModify(user);
    //            if (status)
    //            {
    //                response.IsSuccess = true;
    //                response.CreateSuccessResponse();
    //            }
    //            else
    //            {
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse();
    //                return response;
    //            }

    //        //call send OTP though mobile
    //        MobileNumbemodel mobNo = new MobileNumbemodel();
    //        mobNo.MobileNumber = model.MobileNumber;
    //        mobNo.CountryCode = model.CountryCode;

    //        SendOTPResposeModel otpResponse = await SendResendOTP(mobNo);
    //        if (otpResponse.IsSuccess)
    //        {
    //            response.CreateSuccessResponse("OTP sent on Mobile Number");

    //        }
    //        else
    //        {
    //            response.CreateFailureResponse("OTP not sent Mobile");
    //            return response;
    //        }

    //        ////For testing purpose
    //        // response.OTP = "12345";



    //        //write code to send otp to email
    //        SendOTPByEmailModel sendOTPByEmailModel = new SendOTPByEmailModel();
    //        sendOTPByEmailModel.EmailId = model.EmailId;
    //        sendOTPByEmailModel.OTP = otpResponse.OTP;

    //        bool emailSend = await SendEmailOTP(sendOTPByEmailModel);
    //        if (emailSend)
    //        {
    //            response.IsSuccess = true;
    //            response.CreateSuccessResponse("OTP sent on Mobile Number and Email");
    //        }
    //        else
    //        {
    //            response.CreateFailureResponse("OTP not sent on Email");
    //            response.IsSuccess = false;
    //            return response;
    //        }
    //        return response;
    //    }

    //    /// <summary>
    //    /// This method is used to verify new user and send OTP
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<LoginResponseModel> VerifyNewUserRegistration(OptVerificationModel model)
    //    {
    //        LoginResponseModel response = new LoginResponseModel();

    //        //Verify OTP
    //        Users user = await _unitOfWork.Users.GetUserByMobileNumber(model.MobileNumber);
    //        if (user != null)
    //        {
    //            CommonEntityResponse entityResponse = new CommonEntityResponse(); //await VerifyOTP(model);

    //            //for test purpose
    //            if (model.Otp == "12345")
    //            {
    //                entityResponse.IsSuccess = true;
    //            }
    //            else
    //            {
    //                entityResponse.IsSuccess = false;
    //            }
    //            if (entityResponse.IsSuccess)
    //            {
    //                //Activate the user
    //                user.IsActivate = true;
    //                string scannerData = "UserId=" + user.UserId + ", Mobile=" + user.CountryCode + " " + user.MobileNumber + ", Email=" + user.EmailId;
    //                //create QrScan code
    //                string QRCodeFileName = await _qRScan.CreateQRCode(scannerData, "QR_" + user.UserId);
    //                user.QRCode = "/QRScans/" + QRCodeFileName;
    //                //Create BarCode 
    //                string BarCodeFilrName = await _barcode.CreateBarCode(scannerData, "BR_" + user.UserId);
    //                user.BarCode =  "/BarCodes/" + BarCodeFilrName;
    //                //Adding Default Profile Image
    //                user.ProfileImage = @"/Profile/default.png";

    //                await _unitOfWork.Users.CreateOrModify(user);
    //                var userPassword = _encryptor.EncryptByHash(user.Password);
    //                //send mail
    //                string emailcontent = @"<!DOCTYPE html>
    //                        <html><head>Registartion Email(Digi Recipies system) :</head><body>";
    //                emailcontent += @"<p></p><p><b>Thank you very much. As Your account has been Rrgistered with us : ";
    //                emailcontent += @"</b></p> ";
    //                emailcontent += @"<p><b> Credentilas Deatils are below : </b> ";
    //                emailcontent += @"</p> ";
    //                emailcontent += @"<p><b> User Name/Email :</b> ";
    //                emailcontent += user.EmailId;
    //                emailcontent += @" </p>";
    //                emailcontent += @"<p><b> Password :</b> ";
    //                emailcontent += userPassword;
    //                emailcontent += @" </p>";
    //                emailcontent += @"<p><b>Either you can directly login :</b> ";
    //                emailcontent += "Login link";
    //                emailcontent += @"<p><b>or you can directly Reset Password  :</b> ";
    //                emailcontent += "reset Password link";
    //                emailcontent += @"</p></p> </body> </html>";

    //                bool emailResponse = await _emailSender.SendEmailSMTPAsync( user.EmailId, "Digi Recipies Registraion Details ", "", emailcontent);
    //                if (emailResponse)
    //                {

    //                    response = await Loginprocess(user); ;

    //                    //response.EntityId = user.UserId;
    //                    //response.IsSuccess = true;
    //                    // response.CreateSuccessResponse("Registration Successfully done!,Credentials Details sent on your mail");
    //                }
    //            }
    //            else
    //            {
    //                //revert user if created
    //                //await _unitOfWork.Users.DeleteById(user.UserId);
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("Registration failed");

    //            }
    //        }
    //        else
    //        {
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("Invalid mobile number");
    //            return response;
    //        }
    //        return response;
    //    }

    //    /// <summary>
    //    /// check update password (reset password or forget password link)
    //    /// This method is used send opt on moble to verify account.
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<CommonEntityResponse> MobileEmailVerifcation(ResetPaswordRequestModel model)
    //    {
    //        CommonEntityResponse response = new CommonEntityResponse();

    //        ////to check where email id and mobile number register for same account 
    //        bool status = await _unitOfWork.Users.IsExistEmailId(model.EmailId);
    //        if (status)
    //        {
    //            //check linked mobile number
    //            MobileEmailRequestModel emailRequestModel = new MobileEmailRequestModel();
    //            emailRequestModel.EmailId = model.EmailId;
    //            emailRequestModel.CountryCode = model.CountryCode;
    //            emailRequestModel.MobileNumber = model.MobileNumber;
    //            bool MobileStatus = await _unitOfWork.Users.CheckLinkedMobile(emailRequestModel);
    //            if (MobileStatus)
    //            {
    //                //send mail
    //                //get user data
    //                Users user = await _unitOfWork.Users.GetDataByEmailId(model.EmailId);
    //                if (user != null)
    //                {
    //                    //encrypt UserId
    //                    string encryptedUserId = _encryptor.EncryptByHash(user.UserId.ToString());
    //                    //call email email sending

    //                    string emailcontent = @"<!DOCTYPE html>
    //                                    <html><head>Reset/Update Password</head><body>";
    //                    emailcontent += @"<p><b>Reset Password Link  :</b> ";
    //                    emailcontent += "Reset Password link?" + encryptedUserId;
    //                    emailcontent += @"</p> </body> </html>";
    //                    bool emailStatus = await _emailSender.SendEmailSMTPAsync(user.EmailId, "Reset Password Link", null, emailcontent);
    //                    if (emailStatus)
    //                    {
    //                        response.IsSuccess = true;
    //                        response.CreateSuccessResponse("Reset password Link sent by an email");
    //                    }
    //                    else
    //                    {
    //                        response.CreateFailureResponse("Email not sent");
    //                        response.IsSuccess = false;
    //                    }
    //                }
    //                else
    //                {
    //                    response.IsSuccess = false;
    //                    response.CreateSuccessResponse("User data is missing DB");
    //                }
    //                // response.IsSuccess = true;
    //                //  response.CreateFailureResponse("Mobile Number is verified");
    //            }
    //            else
    //            {
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("Mobile Number is not linked with account.");
    //            }

    //        }
    //        else
    //        {
    //            response.CreateFailureResponse("Email Id is not registered with us.");
    //        }
    //        return response;



    //    }





    //    /// <summary>
    //    /// /// This method is used send opt on moble to verify account. before modifying
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<SendOTPResposeModel> UserModifySendOTPAsync(ModifyUserRequestModel model)
    //    {
    //        SendOTPResposeModel response = new SendOTPResposeModel();
    //        //  response.OtpDetails = new List<SendOtpDetails>();
    //        string ResponseMessage = "";
    //        bool changeEmailStatus = false;
    //        bool changeMobileStatus = false;
    //        Users user = await _unitOfWork.Users.GetById(model.UserId);
    //        if (user != null)
    //        {

    //            //validation to ceck Email and Mobile exit in database or not
    //            if (!user.EmailId.ToLower().Equals(model.EmailId.ToLower()))
    //            {
    //                //to check if email already Registered  or not
    //                bool EmailExist = await _unitOfWork.Users.IsEmailExistWithOtherAccount(model.EmailId, model.UserId);
    //                if (EmailExist)
    //                {
    //                    response.IsSuccess = false;
    //                    response.CreateFailureResponse("EmailId already Registered with another user ");
    //                    return response;
    //                }
    //                else
    //                {
    //                    //email is sending for update
    //                    changeEmailStatus = true; // use to send for otp
    //                    response.SendOtpStatus = true;
    //                }
    //            }
    //            if (!user.CountryCode.Equals(model.CountryCode) || !(user.MobileNumber.Equals(model.MobileNumber)))
    //            {
    //                //to check if mobile already Registered or not
    //                bool MobileExist = await _unitOfWork.Users.IsMobileExistWithOtherAccount(model.CountryCode, model.MobileNumber, model.UserId);
    //                if (MobileExist)
    //                {
    //                    response.IsSuccess = false;
    //                    response.CreateFailureResponse("Mobile Number already Registered with another user ");
    //                    return response;
    //                }
    //                else
    //                {
    //                    //mobile is sending for update
    //                    changeMobileStatus = true; // use to send for otp
    //                    response.SendOtpStatus = true;
    //                }

    //            }


    //            //update another data
    //            user.Title = model.Title;
    //            user.FirstName = model.FirstName;
    //            user.LastName = model.LastName;
    //            user.UpdatedDate = DateTime.UtcNow;
    //            bool modifystatus = await _unitOfWork.Users.ModifyById(user);
    //            if (modifystatus)
    //            {
    //                response.EntityId = user.UserId;
    //                response.IsSuccess = true;
    //                ResponseMessage = "User Details has been Updated successfully.";
    //                //response.CreateSuccessResponse("User Details has been Updated successfully.");                  
    //            }
    //            else
    //            {
    //                response.EntityId = user.UserId;
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("User Details not updated.");
    //                return response;

    //            }

    //            //Send Otp to update Mobile
    //            if (changeMobileStatus)
    //            {

    //                //generate otp

    //                Random generator = new Random();
    //                int otp = 12345;// generator.Next(0, 1000000);
    //                                //int otp = 12345;// _mobileVerification.SendPhoneOTPByTwilio(model.CountryCode, model.MobileNumber);
    //                                //send otp on mobile
    //                MobileNumbemodel OtpModel = new();
    //                OtpModel.CountryCode = model.CountryCode;
    //                OtpModel.MobileNumber = model.MobileNumber;
    //                //otp send to mobile number
    //                SendOTPResposeModel otpResponse = await SendResendOTP(OtpModel);
    //                if (otpResponse.IsSuccess)
    //                {
    //                    response.IsSuccess = true;
    //                    response.OTP = otpResponse.OTP;
    //                    response.OTPType = 1;
    //                    ResponseMessage = ResponseMessage + " And Otp Send to Mobile Number To update Mobile Number.";

    //                }
    //                else
    //                {
    //                    ResponseMessage = ResponseMessage + " And Otp Sending Failed to Mobile Number to Update Mobile Number.";
    //                }
    //            }

    //            if (changeEmailStatus)
    //            {
    //                Random generator = new Random();
    //                SendOTPByEmailModel emailModel = new SendOTPByEmailModel();
    //                emailModel.EmailId = model.EmailId;
    //                emailModel.OTP = "12345";
    //                emailModel.Subject = "OTP to Update User Mobile number or Email";

    //                bool emailStatus = await SendEmailOTP(emailModel);
    //                if (emailStatus)
    //                {
    //                    response.IsSuccess = true;
    //                    response.OTP = emailModel.OTP;
    //                    if (response.OTPType != 1)
    //                        response.OTPType = 2; //only email updateion
    //                    else
    //                        response.OTPType = 3; // email and mobile bot updation
    //                    ResponseMessage = ResponseMessage + " And Otp Send to Email  To update EmailId.";

    //                    //  response.CreateSuccessResponse("OTP sent on Email");
    //                }
    //                else
    //                {
    //                    // response.OTPType = 2;
    //                    ResponseMessage = ResponseMessage + " And Otp Sending Failed to Email to Update EmailId.";
    //                }

    //            }

    //        }
    //        response.CreateSuccessResponse(ResponseMessage);
    //        response.EntityId = user.UserId;
    //        return response;
    //    }


    //    /// <summary>
    //    /// This method is used send opt on email to verify account.
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<bool> SendEmailOTP(SendOTPByEmailModel model)
    //    {
    //        string emailcontent = @"<!DOCTYPE html>
    //                                    <html><head>DIGI Receipt  " + model.Subject;
    //        emailcontent += @"</head><body>";
    //        emailcontent += @"<p><b>Otp  :</b> ";
    //        emailcontent += model.OTP;
    //        emailcontent += @"</p> </body> </html>";
    //        bool emailStatus = await _emailSender.SendEmailSMTPAsync( model.EmailId, model.Subject, null, emailcontent);
    //        // bool emailStatus = true;
    //        if (emailStatus)
    //        {
    //            return true;
    //        }
    //        else
    //        {
    //            return false;
    //        }
    //    }
    //    /// <summary>
    //    /// This method is used remove user by user Id.
    //    /// </summary>
    //    /// <param name="userId"></param>
    //    /// <returns></returns>
    //    public async Task<CommonEntityResponse> RemoveById(int userId)
    //    {
    //        CommonEntityResponse response = new CommonEntityResponse();

    //        bool userStatus = await _unitOfWork.Users.DeleteById(userId);
    //        if (userStatus)
    //        {

    //            response.IsSuccess = true;
    //            response.EntityId = userId;
    //            response.CreateSuccessResponse();
    //        }
    //        else
    //        {
    //            response.CreateFailureResponse("User  not found");
    //            response.IsSuccess = false;
    //            response.EntityId = userId;
    //        }
    //        return response;
    //    }


    //    /// <summary>
    //    /// This method is used remove user by user Id.
    //    /// </summary>
    //    /// <param name="userId"></param>
    //    /// <returns></returns>
    //    public async Task<CommonEntityResponse> UpdateProfileImage(UpdateProfileImageRequestModel model)
    //    {
    //        CommonEntityResponse response = new CommonEntityResponse();

    //        Users user = await _unitOfWork.Users.GetById(model.UserId.Value);
    //        if(user!= null)
    //        {
    //            if (model.ImageFile != null)
    //            {
    //                //Update  image
    //                _media.RemoveFile(_env.WebRootPath + user.ProfileImage);
    //                // _logger.LogInformation("Uploading Product  image to " + _env.WebRootPath + @"\Upload\Offers\" + ".");
    //                user.ProfileImage = await _media.SaveFile(_env.WebRootPath + @"\Profile\", model.ImageFile);
    //                    user.ProfileImage = @"\Profile\" + user.ProfileImage;
    //                await _unitOfWork.Users.CreateOrModify(user);
    //                response.CreateSuccessResponse("Profile Image Updated successfully");
    //            }
    //            else
    //            {
    //                //remove image
                    
    //                if (user.ProfileImage != @"/Profile/default.png")
    //                {
    //                    //remove previous image
    //                     _media.RemoveFile(_env.WebRootPath +  user.ProfileImage);

    //                }
    //                //set as default image

    //                    user.ProfileImage = @"/Profile/default.png";
    //                await _unitOfWork.Users.CreateOrModify(user);
    //                response.CreateSuccessResponse("Profile Image Removed successfully");
    //            }

               
    //            response.IsSuccess = true;
    //            response.EntityId = user.UserId;

    //        }
    //        else
    //        {
    //            response.CreateFailureResponse("User  not found");
    //            response.IsSuccess = false;
    //            response.EntityId = model.UserId.Value;
    //        }
     
    //        return response;
    //    }
    //    /// <summary>
    //    /// This method is used Send or resend.
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<SendOTPResposeModel> SendResendOTP(MobileNumbemodel model)
    //    {
    //        SendOTPResposeModel response = new SendOTPResposeModel();

    //        int otp = 12345;// _mobileVerification.SendPhoneOTPByTwilio(model.CountryCode, model.MobileNumber);
    //        if (otp != 0)
    //        {
    //            response.IsSuccess = true;
    //            response.OTP = otp.ToString();
    //            response.CreateSuccessResponse("OTP sent on mobile Number");
    //        }
    //        else
    //        {
    //            response.CreateFailureResponse("OTP not sent");
    //            response.IsSuccess = false;
    //        }
    //        return response;
    //    }

    //    /// <summary>
    //    /// This method is used verify OTP
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<CommonEntityResponse> VerifyOTP(OptVerificationModel model)
    //    {
    //        CommonEntityResponse response = new CommonEntityResponse();

    //        bool userStatus = _mobileVerification.CheckOTPVerification(model.CountryCode,model.MobileNumber,model.Otp);
    //        if (userStatus)
    //        {
    //            response.CreateSuccessResponse("OTP Verification Successfull");
    //            response.IsSuccess = true;
    //        }
    //        else
    //        {
    //            response.CreateFailureResponse("OTP not verification is pending.");
    //            response.IsSuccess = false;
    //        }
    //        return response;
    //    }
    //    /// <summary>
    //    /// This method is used  Update password again encrypted Userid in BD   .
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<CommonEntityResponse> ResetPassword(ResetPaswordRequestModel model)
    //    {
    //        CommonEntityResponse response = new CommonEntityResponse();
    //        //decrypt UserId
    //        int userId = Convert.ToInt32(_encryptor.DecryptIDs(model.UserId));
    //        //get user data to update password
    //        Users user = await _unitOfWork.Users.GetById(userId);
    //        if (user != null)
    //        {
    //            //decrypt new password and update in DB.
    //            user.Password = _encryptor.EncryptByHash(model.NewPassword);
    //            bool passwordStatus = await _unitOfWork.Users.CreateOrModify(user);
    //            if (passwordStatus)
    //            {
    //                response.IsSuccess = true;
    //                response.CreateSuccessResponse(" New Passowrd has been updated");
    //            }
    //            else
    //            {
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("Pasword not updated");
    //            }

    //        }

    //        return response;
    //    }
    //    /// <summary>
    //    /// This method is used  Update password again encrypted Userid in BD   .
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<CommonEntityResponse> ResetPasswordInAccount(ResetPaswordInAccountRequestModel model)
    //    {
    //        CommonEntityResponse response = new CommonEntityResponse();

    //        //get user data to update password
    //        Users user = await _unitOfWork.Users.GetById(model.UserId);
    //        if (user != null)
    //        {
    //            //decrypt new password and update in DB.
    //            user.Password = _encryptor.EncryptByHash(model.Password);
    //            bool passwordStatus = await _unitOfWork.Users.CreateOrModify(user);
    //            if (passwordStatus)
    //            {
    //                response.IsSuccess = true;
    //                response.CreateSuccessResponse(" New Passowrd has been updated");
    //            }
    //            else
    //            {
    //                response.IsSuccess = false;
    //                response.CreateFailureResponse("Pasword not updated");
    //            }

    //        }

    //        return response;
    //    }
    //    public async Task<QRScanResposeModel> GetQrScanPath(int userId)
    //    {
    //        QRScanResposeModel response = new();
    //        response.ScannerDetails = new();
    //        Users user = await _unitOfWork.Users.GetById(userId);
    //        if (user != null)
    //        {
    //            response.ScannerDetails.QRScan = _config.GetValue<string>("Paths:ImagePath")+user.QRCode;
    //            response.ScannerDetails.BarCode = _config.GetValue<string>("Paths:ImagePath") + user.BarCode;
    //            response.CreateSuccessResponse();
    //            response.IsSuccess = true;
    //        }
    //        else
    //        {
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("Invalid user");
    //        }
    //        return response;
    //    }

    //    /// <summary>
    //    /// This method is used  get the country name ,phone code and currency of the user  .
    //    /// </summary>
    //    /// <param name="model"></param>
    //    /// <returns></returns>
    //    public async Task<CountryResultModel> GetUserCountryDetails(int userId)
    //    {
    //        CountryResultModel response = new();
            
    //        Users user = await _unitOfWork.Users.GetById(userId);
    //        if (user != null)
    //        {
    //            Country country = await _unitOfWork.Countrys.GetCountryByCode(user.CountryCode);
    //            //response.CountryId = country.CountryId;
    //            //response.CountryName = country.CountryName;
    //            response = _mapper.Map<CountryResultModel>(country);
    //            response.CountryGUID = _encryptor.EncryptIDs(response.CountryId.ToString());
    //            response.CountryId = 0;
    //            response.CreateSuccessResponse();
    //            response.IsSuccess = true;
    //            response.EntityId = user.UserId;
    //        }
    //        else
    //        {
    //            response.IsSuccess = false;
    //            response.CreateFailureResponse("Invalid user");
    //        }
    //        return response;
    //    }

      

    //}


}
