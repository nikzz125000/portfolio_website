using ViewModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace API.Helpers
{ 
    public interface IEmailSender
    {
        Task<string> SendEmailTwillioAsync(string toEmail, string subject, string message, string htmlContent);
        Task<bool> SendEmailSMTPAsync( string toEmail, string subject, string message, string htmlContent);

        Task<string> maskEmail(string email);
    }
        public class EmailSender : IEmailSender
      {
        private readonly IConfiguration _configuration;
        private static string _PATTERN = @"(?<=[\w]{1})[\w-\._\+%\\]*(?=[\w]{1}@)|(?<=@[\w]{1})[\w-_\+%]*(?=\.)";
        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        //send mail using Twillio
        public async Task<string> SendEmailTwillioAsync(string toEmail, string subject, string message, string htmlContent)
        {
            try
            {
                return "success";
               // var apiKey = _configuration["SendGrid:ApiKey"];
                //var client = new SendGridClient(apiKey);
                //var from = new EmailAddress("abhilash15102020@gmail.com", "OptiquePlus");
                //var to = new EmailAddress(toEmail);
                //var msg = MailHelper.CreateSingleEmail(from, to, subject, message, htmlContent);
                //var response = await client.SendEmailAsync(msg);
                //return response.StatusCode.ToString();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        //This method to send email by smtp 
        public async Task<bool> SendEmailSMTPAsync(string toEmail,string subject,string message,string htmlContent)
        {
            try
            {
                string result = "";
            //App password for gamil account
            string frompassword = _configuration["SMTPEmailSettings:Password"];//"vbsniacuxpboabev";
            string fromEmail = _configuration["SMTPEmailSettings:UserName"];
            MailMessage msg = new MailMessage();
                msg.From = new MailAddress(fromEmail);
                msg.Subject = subject;
                msg.To.Add(new MailAddress(toEmail));
                msg.IsBodyHtml = true;
                msg.Body = htmlContent;
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port =int.Parse( _configuration["SMTPEmailSettings:Port"]),
                    Credentials = new NetworkCredential(fromEmail, frompassword),
                    EnableSsl = true
                };
                smtpClient.Send(msg);
                return true;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public async Task<string> maskEmail(string s)
        {
            //if (!s.Contains("@"))
            //    return new String('*', s.Length);
            //if (s.Split('@')[0].Length < 4)
            //    return @"*@*.*";
            //return Regex.Replace(s, _PATTERN, m => new string('*', m.Length));
           // string input = "jhon@abc.com";
            string pattern = @"(?<=[\w]{1})[\w\-._\+%]*(?=[\w]{1}@)";
            string result = Regex.Replace(s, pattern, m => new string('*', m.Length));
            return result;
        }
    }

}
