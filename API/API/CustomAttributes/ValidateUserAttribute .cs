using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using API.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using Shared.Enums;
using System.Threading.Tasks;
using API.Helpers;

namespace API.CustomAttributes
{
    public class ValidateUserAttribute : ActionFilterAttribute
    {
        private readonly string _userType;

        public ValidateUserAttribute(string userType)
        {
            _userType = userType;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var req = context.HttpContext.Request;

            // Example: Get the userId from the context (e.g., from headers or token)
            var userId = context.HttpContext.User.FindFirst("UserId")?.Value;
            if (string.IsNullOrWhiteSpace(userId)) {
                context.Result = new UnauthorizedResult();
                return;
            }
            //var userService = context.HttpContext.RequestServices.GetService<IValidateUserService>();
            var userService = context.HttpContext.RequestServices.GetService(typeof(IValidateUserService)) as IValidateUserService;
            var _encryptor = context.HttpContext.RequestServices.GetService(typeof(IEncryptor)) as IEncryptor;  
            //var decriptedId = _encryptor.DecryptIDs(userId);
            var userGuid = int.Parse(userId);
            var res = await userService.GetBctUserDetails(userGuid);
            

            if (res == null) {
                context.Result = new UnauthorizedResult();
                return;
            }
            else if (res.Status != Status.Active)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
            if (_userType == "SupAdmin" && res.UserType != BCTUserType.BctUser)
            {
                return;
            }
            if (_userType == "RegexUser" && res.UserType!=BCTUserType.RegexUser)
            {
                return;
            }
            await next();
        }

        //private bool IsValidUser(string userId)
        //{
        //    // Implement your custom logic to validate the user
        //    // For example, checking the userId against a database
        //    return !string.IsNullOrEmpty(userId); // Placeholder validation logic
        //}
    }
}
