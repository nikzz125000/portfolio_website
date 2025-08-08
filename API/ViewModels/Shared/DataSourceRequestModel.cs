using Shared.Enums;

namespace ViewModels.Shared
{
    public class DataSourceRequestModel
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string? SearchTerm { get; set; } = string.Empty;
        public string? SortOrder { get; set; } = string.Empty;
        public bool ShowInactive { get; set; }
      

        public DataSourceRequestModel()
        {
            SearchTerm = "";
            Page = 1;
            PageSize = 10;
            SortOrder = "";
            ShowInactive = false ;
           
        }
    }

    public class TitleRequestModel
    {
        public int CategoryId { get; set; }

        public TitleRequestModel()
        {
            CategoryId = 0;
        }
    }
    public class RecentTransRequestModel
    {
        public int TransactionRawCount { get; set; }

        public RecentTransRequestModel()
        {
            TransactionRawCount = 0;
        }
    }
}
   
