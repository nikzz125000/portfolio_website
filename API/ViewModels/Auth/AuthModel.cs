using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels.Auth
{
    public class ForgotPasswordModel
    {
        public string username { get; set; }

    }
    public class ResetPasswordModel
    {
        public string Key { get; set; }

        public string Password { get; set; }
    }
    public class updatePasswordModel : ResetPasswordModel
    {
        public string UserName { get; set; }

    }
    public class forgotUserNameModel
    {
        public string emailId { get; set; }

    }
    public class SetNewPassword
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
