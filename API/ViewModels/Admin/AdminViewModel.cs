using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels.Admin
{
   public class AdminResultModel 
    {
        
        public int AdminId { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
   
        public string EmailId { get; set; }
        public string Password { get; set; }
      
        public string MobileNumber { get; set; }
        public string CountryCode { get; set; }
        //  public string CurrencyCode { get; set; }
        public bool Default { get; set; }


        public bool IsActivate { get; set; }

        public string ProfileImage { get; set; }

        public int UserTypeId { get; set; }
        public string Designation { get; set; }

        //refresh token
        public string RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public string CreatedBy { get; set; }
        public string LastModifiedBy { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
