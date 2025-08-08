using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels
{
    public class BctUserRegistrationModel
    {

        public string FirstName { get; set; }

        public string? LastName { get; set; }

        public string EmailId { get; set; }

        public string MobileNumber { get; set; }

        public string CountryCode { get; set; }

        public string UserName { get; set; }

        public Status Status { get; set; }

        public bool IsMobileNumberVerified { get; set; }

        public bool IsEmailVerified { get; set; }

        public bool IsVerified { get; set; }
        public BCTUserType UserType { get; set; }
        [Required]
        public string Password { get; set; }

    }
}

