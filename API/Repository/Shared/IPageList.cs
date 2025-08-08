using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Shared
{
	public interface IPagedList<T> : IPagedList, IList<T>
	{

	}

	public interface IPagedList
	{
		int PageIndex { get; }
		int PageSize { get; }
		int TotalCount { get; }
		int TotalPages { get; }
		bool HasPreviousPage { get; }
		bool HasNextPage { get; }
	}
}
