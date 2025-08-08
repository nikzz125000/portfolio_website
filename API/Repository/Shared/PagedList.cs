using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Shared
{
	public class PagedList<T> : List<T>, IPagedList<T>
	{
		public int PageIndex { get; protected set; }
		public int PageSize { get; protected set; }
		public int TotalCount { get; protected set; }
		public int TotalPages { get; protected set; }

		public bool HasPreviousPage => PageIndex > 1;
		public bool HasNextPage => PageIndex < TotalPages;

		protected PagedList()
		{

		}

		public PagedList(IQueryable<T> source, int pageIndex = 0, int pageSize = int.MaxValue)
		{
			int total = Task.Run(async () => await source.CountAsync()).Result;
			TotalCount = total;
			TotalPages = total / pageSize;

			if (total % pageSize > 0)
			{
				TotalPages++;
			}

			PageSize = pageSize;
			PageIndex = pageIndex <= 1 ? 1 : pageIndex;
			List<T> range = Task.Run(async () => await source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync()).Result;
			AddRange(range);
		}

		public PagedList(IList<T> source, int pageIndex = 0, int pageSize = int.MaxValue)
		{
			TotalCount = source.Count();
			TotalPages = TotalCount / pageSize;

			if (TotalCount % pageSize > 0)
			{
				TotalPages++;
			}

			PageSize = pageSize;
			PageIndex = pageIndex <= 1 ? 1 : pageIndex; ;
			AddRange(source.Skip(pageIndex * pageSize).Take(pageSize).ToList());
		}
	}
}
