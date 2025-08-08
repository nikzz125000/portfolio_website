using System.ComponentModel.DataAnnotations;

namespace ViewModels.Shared
{
    public class BaseViewModel
    {
        public int RowId { get; set; }
    }
   /* public class CandiadteBaseViewModel
    {
        public int CandidateId { get; set; }
    }*/
    public class BaseViewModelWithIdRequired
    {
        [Required]
        public int RowId { get; set; }
    }
}
