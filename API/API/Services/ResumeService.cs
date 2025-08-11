using API;
using API.Helpers;
using Core.Models;
using Repository;
using Shared.Enums;
using ViewModels;
using ViewModels.Auth;
using ViewModels.Shared;

namespace API.Services
{
    public interface IResumeService
    {
        Task<CommonEntityResponse> CreateOrModify(ResumePostModel model);
        Task<ModelEntityResponse<ResumeViewModel>> GetById(int id);
        Task<CommonEntityResponse> connect(ConnectPostModel model);
    }

    public class ResumeService : IResumeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMedia _media;
        IEmailSender _emailSender;
        public ResumeService(IUnitOfWork unitOfWork, IMedia media, IEmailSender emailSender)
        {
            _unitOfWork = unitOfWork;
            _media = media;
            _emailSender = emailSender;
        }

       
        public async Task<CommonEntityResponse> CreateOrModify(ResumePostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();
            try
            {
                Resume entity;
                if (model.Id != 0)
                {
                    entity = await _unitOfWork.Resumes.GetById(model.Id) ?? new Resume();
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

        public async Task<ModelEntityResponse<ResumeViewModel>> GetById(int id)
        {
            ModelEntityResponse<ResumeViewModel> response = new ModelEntityResponse<ResumeViewModel>();
            var data = await _unitOfWork.Resumes.GetById(id);
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

        public async Task<CommonEntityResponse> connect(ConnectPostModel model)
        {
            CommonEntityResponse response = new CommonEntityResponse();

            try
            {
                // Validate the model
                if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Message))
                {
                    response.CreateFailureResponse("Email and Message are required fields.");
                    return response;
                }

                // Get the email template
                string emailContent = GetContactFormEmailTemplate(model);

                // Send email to your business email
                string recipientEmail = "roopeshkv55@gmail.com"; // Your business email
                string subject = $"New Contact Form Submission from {model.Email}";

                bool emailResponse = await _emailSender.SendEmailSMTPAsync(
                    recipientEmail,
                    subject,
                    "",
                    emailContent
                );

                if (emailResponse)
                {
                    response.CreateSuccessResponse("Thank you for your message. We'll get back to you soon!");
                }
                else
                {
                    response.CreateFailureResponse("Failed to send your message. Please try again later.");
                }
            }
            catch (Exception ex)
            {
                response.CreateFailureResponse("An error occurred while processing your request.");
                // Log the exception here
                // _logger.LogError(ex, "Error in connect method");
            }

            return response;
        }

        private string GetContactFormEmailTemplate(ConnectPostModel model)
        {
            string template = @"<!DOCTYPE html>
                                    <html lang=""en"">
                                    <head>
                                        <meta charset=""UTF-8"">
                                        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                                        <title>New Contact Form Submission</title>
                                        <style>
                                            body {
                                                font-family: Arial, sans-serif;
                                                line-height: 1.6;
                                                margin: 0;
                                                padding: 0;
                                                background-color: #f4f4f4;
                                            }
                                            .container {
                                                max-width: 600px;
                                                margin: 20px auto;
                                                background-color: #ffffff;
                                                border-radius: 8px;
                                                overflow: hidden;
                                                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                                            }
                                            .header {
                                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                                color: white;
                                                padding: 30px 20px;
                                                text-align: center;
                                            }
                                            .header h1 {
                                                margin: 0;
                                                font-size: 24px;
                                                font-weight: 300;
                                            }
                                            .content {
                                                padding: 30px 20px;
                                            }
                                            .form-data {
                                                background-color: #f8f9fa;
                                                border-radius: 8px;
                                                padding: 20px;
                                                margin: 20px 0;
                                            }
                                            .field {
                                                margin-bottom: 15px;
                                                padding-bottom: 15px;
                                                border-bottom: 1px solid #e9ecef;
                                            }
                                            .field:last-child {
                                                border-bottom: none;
                                                margin-bottom: 0;
                                                padding-bottom: 0;
                                            }
                                            .field-label {
                                                font-weight: bold;
                                                color: #495057;
                                                margin-bottom: 5px;
                                                font-size: 14px;
                                                text-transform: uppercase;
                                                letter-spacing: 0.5px;
                                            }
                                            .field-value {
                                                color: #212529;
                                                font-size: 16px;
                                                word-wrap: break-word;
                                            }
                                            .message-field {
                                                background-color: #ffffff;
                                                border: 1px solid #dee2e6;
                                                border-radius: 6px;
                                                padding: 15px;
                                                margin-top: 10px;
                                            }
                                            .footer {
                                                background-color: #6c757d;
                                                color: white;
                                                text-align: center;
                                                padding: 20px;
                                                font-size: 12px;
                                            }
                                            .timestamp {
                                                color: #6c757d;
                                                font-size: 12px;
                                                text-align: right;
                                                margin-top: 20px;
                                                font-style: italic;
                                            }
                                            .contact-info {
                                                display: flex;
                                                justify-content: space-between;
                                                margin-bottom: 20px;
                                            }
                                            .contact-item {
                                                flex: 1;
                                                margin-right: 10px;
                                            }
                                            .contact-item:last-child {
                                                margin-right: 0;
                                            }
                                            @media (max-width: 600px) {
                                                .container {
                                                    margin: 10px;
                                                    border-radius: 0;
                                                }
                                                .contact-info {
                                                    flex-direction: column;
                                                }
                                                .contact-item {
                                                    margin-right: 0;
                                                    margin-bottom: 15px;
                                                }
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <div class=""container"">
                                            <div class=""header"">
                                                <h1>📧 New Contact Form Submission</h1>
                                                <p style=""margin: 10px 0 0 0; opacity: 0.9;"">You have received a new message through your website contact form</p>
                                            </div>
        
                                            <div class=""content"">
                                                <div class=""form-data"">
                                                    <div class=""contact-info"">
                                                        <div class=""contact-item field"">
                                                            <div class=""field-label"">📧 Email Address</div>
                                                            <div class=""field-value"">{EMAIL_ADDRESS}</div>
                                                        </div>
                                                        <div class=""contact-item field"">
                                                            <div class=""field-label"">📱 Mobile Number</div>
                                                            <div class=""field-value"">{MOBILE_NUMBER}</div>
                                                        </div>
                                                    </div>
                
                                                    <div class=""field"">
                                                        <div class=""field-label"">💬 Message</div>
                                                        <div class=""message-field field-value"">
                                                            {MESSAGE_CONTENT}
                                                        </div>
                                                    </div>
                                                </div>
            
                                                <div class=""timestamp"">
                                                    Received on: {TIMESTAMP}
                                                </div>
                                            </div>
        
                                            <div class=""footer"">
                                                <p style=""margin: 0;"">This email was automatically generated from your website contact form.</p>
                                                <p style=""margin: 5px 0 0 0;"">Please respond to the customer's email address directly.</p>
                                            </div>
                                        </div>
                                    </body>
                                    </html>";

            // Replace placeholders with actual data
            template = template.Replace("{EMAIL_ADDRESS}", System.Web.HttpUtility.HtmlEncode(model.Email ?? "Not provided"));
            template = template.Replace("{MOBILE_NUMBER}", System.Web.HttpUtility.HtmlEncode(model.MobileNumber ?? "Not provided"));
            template = template.Replace("{MESSAGE_CONTENT}", System.Web.HttpUtility.HtmlEncode(model.Message ?? "").Replace("\n", "<br>"));
            template = template.Replace("{TIMESTAMP}", DateTime.Now.ToString("MMMM dd, yyyy 'at' h:mm tt"));

            return template;
        }
    }
} 