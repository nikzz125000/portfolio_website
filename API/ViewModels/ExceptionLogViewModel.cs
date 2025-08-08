using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Enums;
using ViewModels.Shared;

namespace ViewModels
{
    public class ExceptionLogViewModel
    {
        public Guid ExceptionLogId { get; set; }
        public ApiType ApiType { get; set; }
        public string? ApiTypeName => ApiType.ToString();
        public string? Api { get; set; }
        public Guid UserId { get; set; }
        public string? Parameters { get; set; }
        public string CleanParameters
        {
            get
            {
                return Parameters?
                    .Replace("\r\n", string.Empty)
                    .Replace("\n", string.Empty)
                    .Replace("\t", string.Empty)
                    .Replace("\\", string.Empty)
                    .Replace("\"", "\"");
            }
        }
        public string? Message { get; set; }
        public string? StackTrace { get; set; }
    }
    public class ExceptionLogResultModel : DataSourceResultModel<ExceptionLogViewModel>
    {
    }


    public class ExceptionLogRequestModel : DataSourceRequestModel
    {
        public string? ApiName { get; set; }

    }
}
