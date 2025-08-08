using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels.Shared;
using Microsoft.AspNetCore.Http;

namespace ViewModels.User
{
   public class UserRequestModel
    {
        public string UserGUID { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }    
        public string EmailId { get; set; }
        public string Password { get; set; }
        public string MobileNumber { get; set; }
        public string CountryCode { get; set; }
        public bool Default { get; set; }
        public string UserTypeCode { get; set; }
        public string QRCode { get; set; }
        public string BarCode { get; set; }
        public string ProfileImage  { get; set; }
       // public bool ResendOtpFlag { get; set; }
    }
    public class LoginRequestModel
    {      
        public string EmailId { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; } = false;
        public string MobileNumber { get; set; }
        public string CountryCode { get; set; }
      



    }
    public class LoginResultModel:CommonEntityResponse
    {
        public string UserTypeId { get; set; }



    }
    public class SendOTPResposeModel:CommonEntityResponse
    {
        public SendOTPResposeModel()
        {
            OTP = null;
            SendOtpStatus = false;
            OTPType = 0;
        }
        public string OTP { get; set; }
        public bool SendOtpStatus { get; set; }
        //public List<SendOtpDetails> OtpDetails { get; set; }
        public int OTPType { get; set; }
        public ModifyUserRequestModel Data { get; set; }
    }
    public class QRScanResposeModel : CommonEntityResponse
    {
        public ScannerData ScannerDetails { get; set; }
    }
    public class ScannerData
    {
        public string QRScan { get; set; }
        public string BarCode { get; set; }
    }
    public class ValidateUserResponseModel : CommonEntityResponse
    {
       public ValidateUserResponseModel()
       {
            MessageFlag = false;
           
       }
        public bool MessageFlag { get; set; }
      
    }
    public class LoginResponseModel : CommonEntityResponse 
    {
        public LoginResponseModel()
        {
            Data = new AuthTokensData();
        }
        //public string OTP { get; set; }
        public AuthTokensData Data { get; set; }
        public bool isFirstLogin { get; set; } = false;
        public bool isDigiInvoiceFound { get; set; }=false;

        public string UserTypeCode { get; set; }
       
    }
    public class BctLoginResponseModel : CommonEntityResponse
    {
        public BctLoginResponseModel()
        {
            Data = new AuthTokensData();
        }
        //public string OTP { get; set; }
        public AuthTokensData Data { get; set; }
        public string UserTypeCode { get; set; }
        //public bool IsSuperAdminCreated { get; set; }
      // public bool IsMobileNumberVerified { get; set; }
        //public bool IsEmailVerified { get; set; }
        //public bool isFirstLogin { get; set; } = false;
        public bool IsVerified { get; set; } 
    }
   
    public class AuthTokensData
    {
        public string AccessToken { get; set; }
        public long ExpiresIn { get; set; }
        public string TokenType { get; } = "Bearer";
        public string RefreshToken { get; set; }

    }

    public class RefreshTokenRequestModel
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
    public class UpdateProfileImageRequestModel
    {
        public int? UserId { get; set; }
        //public string ProfileImage { get; set; }
        public IFormFile ImageFile { get; set; }
    }
    public class EndPointUserResponseModel : CommonEntityResponse
    {
        public EndPointUserResponseModel()
        {
            Data = new EndPointUserInfo();
          
        }
     
        public EndPointUserInfo Data { get; set; }
    }
    public class EndPointUserInfo
    {
        public int UserId { get; set; }
        public string UserGUID { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string MobileNumber { get; set; }
        public string CountryCode { get; set; }
       // public string CurrencyCode { get; set; }
        public bool Default { get; set; }
        public int UserTypeId { get; set; }
        public string QRCode { get; set; }
        public string BarCode { get; set; }
        public string ProfileImage { get; set; }
    }
    //public class LoginResponseModel
    //{
    //    public string Status { get; set; }
    //    public int UserId { get; set; }
    //    //public string Title { get; set; }
    //    //public string FirstName { get; set; }
    //    //public string LastName { get; set; }
    //    //public string EmailId { get; set; }
    //    //public string MobileNumber { get; set; }
    //    //public string CountryCode { get; set; }
    //    //public bool Default { get; set; }
    //    //public int UserTypeId { get; set; }
    //    //public string QRCode { get; set; }
    //}
    public class ModifyUserRequestModel
    {
     
        public int UserId { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string MobileNumber { get; set; }
        public string CountryCode { get; set; }
       
        
        public string OTP { get; set; }

    }
    public class UserModifyOTPRequestModel
    {
        public int UserId { get; set; }
        public string MobileOTP { get; set; }
        public string EmailOTP { get; set; }
        public int OtpType { get; set; }
        public string EmailId { get; set; }
        public string MobileNumber { get; set; }
        public string CountryCode { get; set; }
    }
    public class VerifyEmailOTPResponseModel : CommonEntityResponse
    {
        public BctLoginResponseModel LoginData { get; set; }
        public string RegistrationKey { get; set; }
    }
    public class PushNotificationRequest
    {
        public string[] Tokens { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
    }
}
