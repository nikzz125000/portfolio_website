using API.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using Twilio.Clients;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Rest.Verify.V2.Service;

namespace API.Helpers
{
    public interface IMobileVerification
    {
        int SendPhoneOTPByTextLocal(string CountryCode, string MobileNumber);
        int SendPhoneOTPByTwilio(string CountryCode, string MobileNumber);
        string SendPhoneOTPWithServicekeyByTwilio(string CountryCode, string MobileNumber);
        bool CheckOTPVerification(string CountryCode, string MobileNumber, string code);
       // int CreateOtp();

    }
    public class MobileVerification : IMobileVerification
    {
        private readonly TwilioVerifySettings _settings;
        private readonly ITwilioRestClient _client;
        public MobileVerification(IOptions<TwilioVerifySettings> settings)
        {
            _settings = settings.Value;
        }
        /// <summary>
        /// send mobile otp using Twilio service using service key
        /// </summary>
        /// <param name="CountryCode"></param>
        /// <param name="MobileNumber"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public string SendPhoneOTPWithServicekeyByTwilio(string CountryCode, string MobileNumber)
        {

            //send phonenumber verification
            string phonePattern = @"^\+[1-9]\d{1,14}$";
            bool isPhoneValid = Regex.IsMatch(CountryCode + "" + MobileNumber, phonePattern);
             var serviceId = _settings.VerificationServiceSID;
            //var serviceId = "VA185c92a7fb9bc73ac53e4076522790c5";
            if (!isPhoneValid)
            {
                return "Invalid phonenumber";
            }
            else if (string.IsNullOrEmpty(serviceId))
            {
                return "Invalid service id";
            }

            var verification = VerificationResource.CreateAsync(
                                      to: CountryCode + "" + MobileNumber,
                                      channel: "sms",
                                      pathServiceSid: serviceId
                                  );

            //Get user details by country code and phone number
            //var userDetails = await _accountManager.GetUserByPhoneNumberWithCountryCodeAsync(phoneNumber, countryCode);
            //if (userDetails != null)
            //{
            //    //Update phone otp sendtime
            //    userDetails.PhoneOTPCreatedDate = DateTime.UtcNow;
            //    var (Succeeded, Errors) = await _accountManager.UpdateUserAsync(userDetails);
            //}
            return verification.Status.ToString();
        }

        /// <summary>
        /// send mobile otp using Twilio service using token key
        /// </summary>
        /// <param name="CountryCode"></param>
        /// <param name="MobileNumber"></param>
        /// <returns></returns>
        public int SendPhoneOTPByTwilio(string CountryCode, string MobileNumber)
        {
            int Otp = CreateOtp();
            var client1 = new TwilioRestClient(_settings.AccountSID, _settings.AuthToken);
            var message = MessageResource.Create(to:CountryCode+MobileNumber,from: "+12518423495", body:"your otp is for Digital Receipt "+ Otp, client: client1);
            return Otp;
        }
        /// <summary>
        /// verify entered mobile otp
        /// </summary>
        /// <param name="CountryCode"></param>
        /// <param name="MobileNumber"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        public bool CheckOTPVerification(string CountryCode, string MobileNumber, string code)
        {
           
            var verificationCheckResource = VerificationCheckResource.CreateAsync(
                    to: CountryCode + "" + MobileNumber,
                    code: code,
                    pathServiceSid: _settings.VerificationServiceSID
                    );
            var result = verificationCheckResource.Status.Equals("approved") ? "OTP is verified." : "Invalid OTP.";
            if (result == "OTP is verified.")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public int SendPhoneOTPByTextLocal(string CountryCode, string MobileNumber)
        {
            int Otp = CreateOtp();
            string mobile = CountryCode + "" + MobileNumber;
            string phonePattern = @"^\+[1-9]\d{1,14}$";
            bool isPhoneValid = Regex.IsMatch(CountryCode + "" + MobileNumber, phonePattern);
            string APIKey = "MzMzMzZlNzQ3ODRjMzk1NjdhMzE1ODMzNDQ3NzUwNzM=";
            String message = HttpUtility.UrlEncode("Your OTP is " + Otp + " .");
            using (var wb = new WebClient())
            {
                byte[] response = wb.UploadValues("https://api.textlocal.in/send/", new NameValueCollection()
                {
                    { "apikey","MzMzMzZlNzQ3ODRjMzk1NjdhMzE1ODMzNDQ3NzUwNzM=" },
                    {"numbers", mobile },
                    {"message",message },
                    {"sender","textlocal" }
                });
                string result = System.Text.Encoding.UTF8.GetString(response);
            }
            return 1;
        }
        /// <summary>
        /// create random Otp
        /// </summary>
        /// <returns></returns>
        public int CreateOtp()
        {
            Random random = new Random();
            return random.Next(1001, 9999);
        }
    }


}
