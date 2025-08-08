using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ViewModels.Shared.Interfaces
{
	public interface IModelStateValidationResponse
	{
		void CreateModelStateValidationResponse(string message = null);
		void CreateModelStateValidationResponse(ModelStateDictionary modelState);
	}
}
