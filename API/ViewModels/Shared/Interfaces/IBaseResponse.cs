using Shared.Enums;

namespace ViewModels.Shared.Interfaces
{
	public interface IBaseResponse
	{
		string Message { get; set; }
		ResponseType Type { get; set; }
		bool IsSuccess { get; set; }
		ResponseCode Code { get; set; }
	}
}
