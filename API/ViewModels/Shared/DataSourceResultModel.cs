using System;
using System.Collections.Generic;

namespace ViewModels.Shared
{
	public class DataSourceResultModel<T>
	{
		public T[] Data { get; set; }
		public int Total { get; set; }
		public bool HasNext { get; set; }
		public bool HasPreviousPage { get; set; }
		public int CurrentPage { get; set; }
		public int CurrentPageSize { get; set; }

		public DataSourceResultModel()
		{
			HasNext = false;
			Total = 0;
			CurrentPage = 1;
			CurrentPageSize = 100;
			Data = Array.Empty<T>();
		}
	}

	public class SelectBoxDataViewModel
	{
		public IEnumerable<ValueCaptionPair> Titles { get; set; }
	}
}
