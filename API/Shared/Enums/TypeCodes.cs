using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Enums
{
    
    [Serializable]
    public enum Status : long
    {
        Active = 1,
        Suspend = 2,
        Delete = 3
    }
    
    [Serializable]
    public enum ApiType : long
    {
        Get = 1,
        Post = 2,
        Put = 3,
        Delete =4
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
    
    
    [Serializable]
    public enum BCTUserType : long
    {
        BctUser = 1,
        RegexUser = 2
    }
   
    public enum BackgroundType
    {
        None=0,
        Interior=1,
        Exterior=2,
    }
}
