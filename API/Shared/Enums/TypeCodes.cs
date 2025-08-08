using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Enums
{
    [Serializable]
    public enum PrintType : long
    {
        Digital =1,
        Physical = 2,
        Both = 3
    }
    [Serializable]
    public enum Status : long
    {
        Active = 1,
        Suspend = 2,
        Delete = 3
    }
    [Serializable]
    public enum AdvertisementStatus : long
    {
        New = 1,
        Approved = 2,
        Rejected = 3,
        Pending = 4
    }
    [Serializable]
    public enum AdvertisementStatusFilter : long
    {
        All = 0,
        New = 1,
        Approved = 2,
        Rejected = 3,
        Pending = 4,
    }
    [Serializable]
    public enum ConfirmationStatus : long
    {
        Pending = 0,
        Confirm = 1,
        Decline = 2
    }
    [Serializable]
    public enum ApiType : long
    {
        Get = 1,
        Post = 2,
        Put = 3,
        Delete =4
    }
    public enum StatusType
    {
        Image=1,
        Video
    }
    public enum FileType
    {
        Image = 1,
        Video,
        Audio,
        PDF_Document,
        Word_Document,
        Excel_Spreadsheet,
        PowerPoint_Presentation,
        Text_Document,
        Compressed_Archive,
        Unknown
    }
    public enum BookingStatus : long
    {
        Pending = 1,
        Read = 2,
        Approved = 3
    }
    public enum BookingStatusFilter : long
    {
        All = 0,
        Pending = 1,
        Read = 2,
        Approved = 3
    }
    public enum SupportStatus : long
    {
        Pending = 1,
        Read = 2,
        Approved = 3
    }
    public enum SupportStatusFilter : long
    {
        All = 0,
        Pending = 1,
        Read = 2,
        Approved = 3
    }
    public enum NotificationType
    {
        Invoice = 1,
        PaymentMethord
    }
    public enum OfferStatus
    {
        New = 1,
        Approved = 2,
        Rejected = 3,
        Pending = 4
    }
    public enum FireBaseUserTypes
    {
        Customer = 1,
        Vendor = 2,
    }
    [Serializable]
    public enum BannerType : long
    {
        Registration = 1,
    }
    public enum BannerTypeFilter : long
    {
        All = 0,
        Registration = 1,
    }
    [Serializable]
    public enum BCTUserType : long
    {
        BctUser = 1,
        RegexUser = 2
    }
    public enum PaidStatus : long
    {
        Unpaid = 0,
        Paid = 1,
        PartiallyPaid = 2
    }
    public enum DiscountType : long
    {
        Amount = 0,
        Percentage = 1,
    }
    public enum EventType : long
    {
        CREATED = 0,
        EDITED,
        ADDITIONAL_BILL_DISCOUNT,
        PAYMENT_STATUS_CHANGED,
        PAYMENT_RECEIVED,
        CANCELLED,
        DELETED,
        NOTE_CREATED,
        NOTE_UPDATED,
        NOTE_DELETED,
    }
}
