using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Shared
{
    public class DapperPagedList<T> : PagedList<T>
    {
        public DapperPagedList(IEnumerable<T> items, int count, int pageIndex = 0, int pageSize = int.MaxValue)
        {
            PageSize = pageSize;
            PageIndex = pageIndex <= 1 ? 1 : pageIndex;

            TotalCount = count;
            TotalPages = count / pageSize;
            if (count % pageSize > 0)
            {
                TotalPages++;
            }
            AddRange(items);
        }
    }
}
