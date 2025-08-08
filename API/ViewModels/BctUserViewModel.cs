using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels.Shared;

namespace ViewModels
{
    public class BctUserViewModel
    {
        public int BctUserId { get; set; }
        public string BctUserGUID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string MobileNumber { get; set; }
        public string CountryCode { get; set; }
        public bool IsVerified { get; set; }
        public Status Status { get; set; }
        public string UserName { get; set; }
        public bool IsMobileNumberVerified { get; set; }
        public bool IsEmailVerified { get; set; }
        public BCTUserType UserType { get; set; }

    }
    public class BctUserRequestModel
    {
        public string BctUserGUID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        //public string EmailId { get; set; }
        //public string MobileNumber { get; set; }
        //public string CountryCode { get; set; }
        //public string UserName { get; set; }
        //public string Password { get; set; }

    }
    public class BctUserUserIdRequestModal : BctUserRequestModel
    {
        // public int UserId { get; set; }
        public string? BctUserGUID { get; set; }

    }
    public class ValidateBctUserModel : CommonEntityResponse
    {
        public int BctUserId { get; set; }
        public string UserName { get; set; }
        public string MobileNumber { get; set; }
        public string CountryCode { get; set; }
        public bool IsVerified { get; set; }
        public string UserTypeCode { get; set; }
        public int? OrganizationDetailsId { get; set; }
        public int? ShopDetailsId { get; set; }
    }
    public class BctUserPaginationRequestModel : DataSourceRequestModel
    {
        public string FirstName { get; set; }

    }
    public class BctUserPaginationResultModel : DataSourceResultModel<BctUserResultModel>
    {

    }
    public class BctUserDropDownModel
    {
        public int BctUserId { get; set; }
        public string BctUserGUID { get; set; }
        public string BctUserName { get; set; }
    }

    public class BctUserResultModel
    {
        public int BctUserId { get; set; }
        public string BctUserGUID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Designation { get; set; }
        public string EmailId { get; set; }
        public string MobileNumber { get; set; }
        public string CountryCode { get; set; }
        public string UserName { get; set; }
        public string UserTypeCode { get; set; }
        public int? OrganizationId { get; set; }
        public bool IsVerified { get; set; }
        public Status Status { get; set; }
        public bool IsMobileNumberVerified { get; set; }
        public bool IsEmailVerified { get; set; }
    }
}
