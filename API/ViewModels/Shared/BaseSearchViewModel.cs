using System.Collections.Generic;

namespace ViewModels.Shared
{
    public class BaseSearchViewModel
    {
        public string Title { get; set; }
        public string Location { get; set; }
        public string Type { get; set; }
        public string Expereince { get; set; }
        public int LastDays { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool ShowInactive { get; set; }

        public BaseSearchViewModel()
        {
            Title = string.Empty;
            Location = string.Empty;
            Type = string.Empty;
            Expereince = string.Empty;
            LastDays = 0;
            PageIndex = 0;
            PageSize = int.MaxValue;
            ShowInactive = false;
        }
    }
}
