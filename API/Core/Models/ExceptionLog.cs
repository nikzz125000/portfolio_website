using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class ExceptionLog : WebSiteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ExceptionLogId { get; set; }

        [MaxLength(50)]
        public string ExceptionType { get; set; }

        public ApiType ApiType { get; set; }

        public string Api { get; set; }

        public int? VendorUserId { get; set; }

        public string Parameters { get; set; }

        public string Message { get; set; }

        public string StackTrace { get; set; }

        [MaxLength(50)]
        public string? Environment { get; set; }
    }
}