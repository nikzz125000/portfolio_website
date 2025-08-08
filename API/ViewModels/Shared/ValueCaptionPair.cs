using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModels.Shared
{
	public class ValueCaptionPair
	{
		public string Value { get; set; }
		public string Caption { get; set; }
	}

	public class ValueCaptionPairWithParent: ValueCaptionPair
	{
		public string ParentId { get; set; }
	}

}
